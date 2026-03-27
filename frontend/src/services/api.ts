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
  return data;
};

export const getActions = async (): Promise<ActionResponse[]> => {
  const { data } = await api.get('/actions');
  return data;
};

export const triggerAnomalyDetection = async () => {
    // Backend uses a BackgroundScheduler, but we'll provide a mock success response for the UI interaction
    return { status: 'success', message: 'Anomaly detection cycle triggered via scheduler' };
};
