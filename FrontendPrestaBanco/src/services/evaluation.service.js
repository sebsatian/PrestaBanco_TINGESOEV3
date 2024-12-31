import http from '../http-common';

const evaluateRequest = (formData) => {
  const { request, ...params } = formData; 
  const urlParams = new URLSearchParams(params).toString();
  
  return http.post(`/evaluation/evaluate?${urlParams}`, request);
};


const getEvaluationById = (requestId) => {
  return http.get(`/evaluation/${requestId}`);
};

const getSavingCapacity = (requestId) => {
  return http.get(`/saving-capacity/${requestId}`);
};

export default {
  evaluateRequest,
  getEvaluationById,
  getSavingCapacity,
};