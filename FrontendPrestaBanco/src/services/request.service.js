import http from '../http-common';

const createFirstHomeRequest = (formData) => {
  return http.post('/firsthomereq/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const createSecondHomeRequest = (formData) => {
  return http.post('/secondhomereq/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const updateRequestStatus = (id, statusUpdate) => {
  return http.post(`/requests/${id}/status`, { statusUpdate });
};

const updateRequestDetails = (id, details) => {
  return http.post(`/requests/${id}/details`, { detailsUpdate: details });
};

const createRemodelingRequest = (formData) => {
  return http.post('/remodelingreq/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const createBusinessRequest = (formData) => {
  return http.post('/businessreq/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};



const getSimulationById = (simulationId) => {
  return http.get(`/simulate/${simulationId}`);
};


const getLoanTypeById = (loanTypeId) => {
  return http.get(`/loan-types/${loanTypeId}`);
};


const getAllRequests = () => {
  return http.get('/requests/all');
};


const getRequestById = (id) => {
  return http.get(`/requests/${id}`);
};


const getRequestsByRut = (rut) => {
  return http.get(`/requests/rut/${rut}`);
};

const getTotalCosts = (requestId) => {
  return http.get(`/total-costs/${requestId}`);
};

const postTotalCosts = (requestId) => {
  return http.post(`/total-costs/create/${requestId}`);
};

export default {
  getSimulationById,
  createFirstHomeRequest,
  createSecondHomeRequest,
  createRemodelingRequest,
  updateRequestStatus,
  createBusinessRequest,
  getLoanTypeById,
  getAllRequests,
  getRequestById,
  getRequestsByRut, 
  updateRequestDetails,
  getTotalCosts,
  postTotalCosts,
};