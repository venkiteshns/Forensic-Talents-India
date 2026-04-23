import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Will be changed to hosted backend later
});

export default api;
