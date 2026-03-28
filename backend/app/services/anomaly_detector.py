from dataclasses import dataclass
from typing import List, Tuple, Dict
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import torch
import torch.nn as nn
from sklearn.preprocessing import StandardScaler

from app.core.config import get_settings
from app.db.repositories.cost_repository import CostRecordRepository
from app.db.repositories.metric_repository import MetricRepository
from app.models.resource import Resource
from app.schemas.metrics import MetricCreate
from app.services.models.autoencoder import AnomalyAutoencoder

settings = get_settings()

@dataclass
class AnomalyResult:
    is_anomaly: bool
    score: float
    reason: str
    confidence: float = 1.0
    drivers: Dict[str, float] = None

class FeatureEngineer:
    """Handles time-based features, rolling averages, and normalization."""
    
    @staticmethod
    def prepare_training_data(historical_metrics, historical_costs) -> pd.DataFrame:
        data = []
        for i, m in enumerate(historical_metrics):
            cost = historical_costs[i].estimated_cost if i < len(historical_costs) else 0.0
            ts = getattr(m, 'timestamp', pd.Timestamp.now())
            data.append({
                "cpu": m.cpu_usage,
                "memory": m.memory_usage,
                "requests": m.requests,
                "storage": m.storage_used,
                "cost": cost,
                "hour": ts.hour if hasattr(ts, 'hour') else 12,
                "day_of_week": ts.dayofweek if hasattr(ts, 'dayofweek') else 0
            })
        
        df = pd.DataFrame(data)
        if df.empty:
            return df
            
        # 1. Rolling averages (window size 5)
        df['rolling_cpu'] = df['cpu'].rolling(window=5, min_periods=1).mean()
        df['rolling_req'] = df['requests'].rolling(window=5, min_periods=1).mean()
        df['rolling_cost'] = df['cost'].rolling(window=5, min_periods=1).mean()
        
        # 2. Efficiency Metrics (Domain Knowledge)
        denom = df['requests'].apply(lambda x: max(x, 1))
        df['cost_per_req'] = df['cost'] / denom
        df['cpu_per_req'] = df['cpu'] / denom
        df['mem_per_req'] = df['memory'] / denom
        
        # 3. Growth Rates
        df['storage_growth'] = df['storage'].diff().fillna(0)
        df['cost_growth'] = df['cost'].diff().fillna(0)
        
        return df

class AnomalyDetector:
    # Model Cache: Store (IF, AE, count, score_history) per resource_id
    _CACHE: Dict[str, Dict] = {}

    def __init__(self, metric_repository: MetricRepository, cost_repository: CostRecordRepository):
        self.metric_repository = metric_repository
        self.cost_repository = cost_repository
        self.scaler = StandardScaler()

    def _train_autoencoder(self, x_train: torch.Tensor, epochs: int = 50) -> nn.Module:
        input_dim = x_train.shape[1]
        model = AnomalyAutoencoder(input_dim)
        optimizer = torch.optim.Adam(model.parameters(), lr=0.01)
        criterion = nn.MSELoss()
        
        model.train()
        for _ in range(epochs):
            optimizer.zero_grad()
            outputs = model(x_train)
            loss = criterion(outputs, x_train)
            loss.backward()
            optimizer.step()
        return model

    def detect(self, resource: Resource, metric: MetricCreate, estimated_cost: float) -> AnomalyResult:
        res_id = resource.id
        
        # Ensure cache structure
        if res_id not in self._CACHE:
            self._CACHE[res_id] = {"if": None, "ae": None, "count": 0, "scores": []}
        
        cache = self._CACHE[res_id]
        cache["count"] += 1

        # 1. Data Context
        historical = self.metric_repository.recent_for_resource(res_id, limit=settings.default_metric_window)
        historical_costs = list(reversed(self.cost_repository.recent_for_resource(res_id, limit=len(historical) or 1)))
        
        if len(historical) < settings.anomaly_min_training_points:
            return self._fallback_rule_detection(historical, metric, estimated_cost)

        # 2. Advanced Feature Engineering
        df_train = FeatureEngineer.prepare_training_data(historical, historical_costs)
        
        # Interpolate current features using latest point + rolling window
        current = df_train.iloc[-1].to_dict()
        current.update({
            "cpu": metric.cpu_usage, "memory": metric.memory_usage, "requests": metric.requests, 
            "storage": metric.storage_used, "cost": estimated_cost
        })
        # Recalculate rolling and efficiency on the fly for current point
        current['rolling_cpu'] = (df_train['cpu'].iloc[-4:].sum() + metric.cpu_usage) / 5
        current['rolling_req'] = (df_train['requests'].iloc[-4:].sum() + metric.requests) / 5
        current['rolling_cost'] = (df_train['cost'].iloc[-4:].sum() + estimated_cost) / 5
        
        denom = max(metric.requests, 1)
        current['cost_per_req'] = estimated_cost / denom
        current['cpu_per_req'] = metric.cpu_usage / denom
        current['mem_per_req'] = metric.memory_usage / denom
        current['storage_growth'] = metric.storage_used - df_train['storage'].iloc[-1]
        current['cost_growth'] = estimated_cost - df_train['cost'].iloc[-1]

        df_current = pd.DataFrame([current])
        
        # Scaling
        x_train = self.scaler.fit_transform(df_train[settings.feature_names])
        x_current = self.scaler.transform(df_current[settings.feature_names])
        
        # 3. Model Training (OPTIMIZED: Periodic Retraining)
        if cache["if"] is None or cache["count"] % settings.anomaly_retrain_interval == 0:
            if_model = IsolationForest(contamination=settings.isolation_forest_contamination, random_state=42, n_estimators=100)
            if_model.fit(x_train)
            cache["if"] = if_model
            
            x_t = torch.FloatTensor(x_train)
            cache["ae"] = self._train_autoencoder(x_t)

        # 4. Inference
        if_score = float(-cache["if"].decision_function(x_current)[0])
        
        cache["ae"].eval()
        with torch.no_grad():
            x_curr_t = torch.FloatTensor(x_current)
            recon = cache["ae"](x_curr_t)
            ae_error = torch.mean((x_curr_t - recon)**2).item()
        
        rule_score, rule_reasons = self._calculate_rule_score(historical, metric, estimated_cost)
        
        # 5. Hybrid Weighted Scoring (NORMALIZED)
        # Score calculation (Normalize parts tentatively to 0-1)
        final_score = min(max(
            (if_score * settings.anomaly_if_weight) + 
            (ae_error * settings.anomaly_ae_weight) + 
            (rule_score * settings.anomaly_rule_weight), 0), 1)

        # 6. Dynamic Thresholding (Adaptive)
        cache["scores"].append(final_score)
        if len(cache["scores"]) > 50: cache["scores"].pop(0)
        
        is_anomaly = False
        if len(cache["scores"]) >= 20:
            threshold = np.mean(cache["scores"]) + (settings.anomaly_dynamic_threshold_sigma * np.std(cache["scores"]))
            is_anomaly = final_score > max(threshold, 0.45) # Never lower than 0.45 baseline
        else:
            is_anomaly = final_score > 0.45 or rule_score > 0.8

        # 7. Explainability: Top 3 Drivers
        drivers = {}
        for i, col in enumerate(settings.feature_names):
            drivers[col] = float(abs(x_current[0][i] - np.mean(x_train[:, i])))
        
        # Sort and pick Top 3
        sorted_drivers = sorted(drivers.items(), key=lambda kv: kv[1], reverse=True)[:3]
        top_drivers_names = [d[0] for d in sorted_drivers]
        
        final_reasons = rule_reasons
        if is_anomaly and not final_reasons:
            final_reasons.append(f"AI Hybrid detected abnormal behavior (Top Drivers: {', '.join(top_drivers_names)})")

        return AnomalyResult(
            is_anomaly=is_anomaly,
            score=round(final_score, 4),
            reason="; ".join(final_reasons),
            confidence=0.9 if is_anomaly else 1.0,
            drivers=drivers
        )

    def _calculate_rule_score(self, historical, metric, cost) -> Tuple[float, List[str]]:
        score = 0.0
        reasons = []
        if not historical:
            return 0.0, []
            
        avg_req = sum(m.requests for m in historical) / len(historical)
        avg_cpu = sum(m.cpu_usage for m in historical) / len(historical)
        
        if avg_req > 0 and metric.requests > avg_req * settings.high_request_spike_multiplier:
            score += 0.8
            reasons.append(f"Request spike detected ({metric.requests} vs avg {avg_req:.1f})")
            
        if metric.cpu_usage > max(avg_cpu * 2.5, 90):
            score += 0.6
            reasons.append(f"Critical CPU load ({metric.cpu_usage:.1f}%)")
            
        if cost > settings.cost_threshold_for_stop * 2:
            score += 0.4
            reasons.append("Extreme cost projection")
            
        return min(score, 1.0), reasons

    def _fallback_rule_detection(self, historical, metric, cost) -> AnomalyResult:
        score, reasons = self._calculate_rule_score(historical, metric, cost)
        return AnomalyResult(
            is_anomaly=score > 0.5,
            score=score,
            reason="; ".join(reasons) if reasons else "Insufficient data for ML; Baseline normal"
        )
