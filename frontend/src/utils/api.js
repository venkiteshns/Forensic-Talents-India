import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://forensic-talents-india.onrender.com/api';

const api = axios.create({
  baseURL: BACKEND_URL,
});

export default api;
