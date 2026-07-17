import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Automatically set the authorization header if token exists in localStorage
const savedToken = localStorage.getItem('authToken');
if (savedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

export const setToken = (token) => {
  if(token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('authToken', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('authToken');
  }
};

export default api;
