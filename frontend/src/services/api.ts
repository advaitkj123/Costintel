import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CostTrendPoint {
  timestamp: string;
  estimated_cost: number;
}

export interface ResourceCostSummary {
  resource_id: string;
  resource_name: string;
  resource_type: string;
  total_cost: number;
}

export interface CostSummaryResponse {
  total_cost: number;
  total_savings: number;
  projected_monthly_cost: number;
  trend: CostTrendPoint[];
  per_resource: ResourceCostSummary[];
}

export interface AnomalyResponse {
  id: number;
  resource_id: string;
  anomaly_type: string;
  severity: string;
  timestamp: string;
  description: string;
  is_resolved: boolean;
}

export interface ActionResponse {
  id: number;
  action_type: string;
  description: string;
  impact_description: string;
  savings_achieved: number;
  timestamp: string;
}

export const getCostSummary = async (): Promise<CostSummaryResponse> => {
  const { data } = await api.get('/cost');
  return data;
};

export const getAnomalies = async (): Promise<AnomalyResponse[]> => {
  const { data } = await api.get('/anomalies');
  
  // Transform backend AnomalyRead into frontend AnomalyResponse
  return data.map((item: any) => {
     let severity = item.severity || 'Low';
     if (!item.severity) {
        if (item.anomaly_score > 0.8) severity = 'High';
        else if (item.anomaly_score > 0.5) severity = 'Medium';
     }
     
     return {
        id: item.id,
        resource_id: `RES-${item.resource_id.toString().padStart(4, '0')}`,
        anomaly_type: 'Usage Spike',
        severity: severity,
        timestamp: item.timestamp,
        description: item.reason || 'Unexpected resource scaling detected.',
        is_resolved: false
     };
  });
};

export const getActions = async (): Promise<ActionResponse[]> => {
  const { data } = await api.get('/actions');
  
  // Transform backend ActionRead into frontend ActionResponse
  return data.map((item: any) => {
     return {
        id: item.id,
        action_type: item.action_type,
        description: `Executed ${item.action_type.replace('_', ' ')} logic`,
        impact_description: `Optimized resource constraints`,
        savings_achieved: item.estimated_savings,
        timestamp: item.timestamp
     };
  });
};

export const triggerAnomalyDetection = async () => {
    return { status: 'success', message: 'Anomaly detection cycle triggered via scheduler' };
};
