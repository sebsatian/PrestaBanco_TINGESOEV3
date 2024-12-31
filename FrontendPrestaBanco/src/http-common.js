import axios from "axios";

const backendServer = import.meta.env.VITE_PRESTABANCO_BACKEND_SERVER;
const backendPort = import.meta.env.VITE_PRESTABANCO_BACKEND_PORT;

const httpClient = axios.create({
    baseURL: `http://${backendServer}:${backendPort}`,
    headers: {
        'Content-Type': 'application/json'
    }
});

export default httpClient;
