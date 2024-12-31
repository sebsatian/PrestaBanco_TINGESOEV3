import httpClient from '../http-common';

const simulateLoan = (simulationData) => {
  return httpClient.post('/simulation/simulate', simulationData);
};

const getSimulationById = (simulationId) => {
  return httpClient.get(`/simulation/simulate/${simulationId}`);
};

const updateSimulation = (simulationId, updatedSimulation) => {
  return httpClient.put(`/simulation/change/${simulationId}`, updatedSimulation);
};

export default {
  simulateLoan,
  getSimulationById,
  updateSimulation,
};