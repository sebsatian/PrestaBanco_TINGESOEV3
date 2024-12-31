// services/loantype.service.js
import httpClient from '../http-common';

const getAllLoanTypes = () => {
  return httpClient.get('/loan-types');
};

const getLoanTypeById = (loanTypeId) => {
  return httpClient.get(`/loan-types/${loanTypeId}`);
};

const updateLoanType = (loanTypeId, updatedLoanType) => {
  return httpClient.put(`/loan-types/${loanTypeId}`, updatedLoanType);
};

export default {
  getAllLoanTypes,
  getLoanTypeById,
  updateLoanType,
};