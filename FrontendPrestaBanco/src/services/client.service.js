import http from '../http-common';

const registerClient = (clientData) => {
  return http.post('/api/client/register', clientData);
};

export default {
  registerClient
};
