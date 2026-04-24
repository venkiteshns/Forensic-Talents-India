import axios from 'axios';

const api = axios.create({
  baseURL: 'https://forensic-talents-india.onrender.com/api',
});

export default api;
