import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCosts = async (days: number = 7) => {
  const { data } = await api.post(`/costs/fetch/?days=${days}`);
  return data;
};

export const getStoredCosts = async () => {
  const { data } = await api.get('/costs/');
  return data;
};

export const triggerAnomalyDetection = async () => {
  const { data } = await api.post('/anomalies/detect/');
  return data;
};

export const getAnomalies = async () => {
  const { data } = await api.get('/anomalies/');
  return data;
};

export const getOptimizationActions = async () => {
  const { data } = await api.get('/actions/');
  return data;
};

