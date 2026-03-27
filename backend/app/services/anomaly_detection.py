import logging
from collections import defaultdict
from typing import List, Dict, Any

from app.services.ai_insight import AIInsightService

logger = logging.getLogger(__name__)

class AnomalyDetectionService:
    def detect_anomalies(self, cost_data: List[Dict[str, Any]]):
        """
        Placeholder for ML-based anomaly detection.
        Refined logic: Checks for spikes > 30% and adds AI insights.
        """
        logger.info(f"Running anomaly detection on {len(cost_data)} cost records.")
        
        service_costs = defaultdict(list)
        for record in cost_data:
            service_costs[record['service']].append(record)
            
        anomalies = []
        for service, records in service_costs.items():
            if len(records) < 2:
                continue 
            
            past_records = records[:-1]
            avg_cost = sum(r['amount'] for r in past_records) / len(past_records)
            latest_record = records[-1]
            
            if latest_record['amount'] > 0 and avg_cost > 0:
                diff_pct = ((latest_record['amount'] - avg_cost) / avg_cost)
                
                # Dynamic Threshold: > 30% spike
                if diff_pct > 0.3:
                    severity = "critical" if diff_pct > 1.0 else "high" if diff_pct > 0.5 else "medium"
                    
                    insight = AIInsightService.generate_insight(
                        service=service, 
                        actual=latest_record['amount'], 
                        expected=avg_cost
                    )
                    
                    anomalies.append({
                        "service": service,
                        "date": latest_record['date'],
                        "expected_cost": round(avg_cost, 4),
                        "actual_cost": round(latest_record['amount'], 4),
                        "severity": severity,
                        "status": "detected",
                        "insight": insight
                    })
        return anomalies
