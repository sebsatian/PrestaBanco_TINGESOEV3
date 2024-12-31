// http-common.js
import axios from "axios";

const backendServer = import.meta.env.VITE_PRESTABANCO_BACKEND_SERVER;
const backendPort = import.meta.env.VITE_PRESTABANCO_BACKEND_PORT;

const httpClient = axios.create({
  baseURL: `http://${backendServer}:${backendPort}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor que se ejecuta ANTES de la petición
httpClient.interceptors.request.use(
  (config) => {
    // Inicia la barra de carga
    if (window.startLoading) {
      window.startLoading();
    }
    return config;
  },
  (error) => {
    // Si hay error en la petición, detenemos la barra
    if (window.endLoading) {
      window.endLoading();
    }
    return Promise.reject(error);
  }
);

// Interceptor que se ejecuta DESPUÉS de recibir la respuesta
httpClient.interceptors.response.use(
  (response) => {
    // Finaliza la barra de carga
    if (window.endLoading) {
      window.endLoading();
    }
    return response;
  },
  (error) => {
    // Finaliza también si la respuesta da error
    if (window.endLoading) {
      window.endLoading();
    }
    return Promise.reject(error);
  }
);

export default httpClient;
