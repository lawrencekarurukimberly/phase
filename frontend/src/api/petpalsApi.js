// frontend/src/api/petpalsApi.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const petpalsApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach Firebase ID Token to every request
petpalsApi.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Auth Endpoints (for profile creation/fetching, not direct login/register) ---
export const registerProfile = (userData) => petpalsApi.post('/auth/register-profile', userData);
export const getProfile = () => petpalsApi.get('/auth/profile');

// --- Pet Endpoints ---
export const getPets = (filters) => petpalsApi.get('/pets', { params: filters });
export const getPetById = (id) => petpalsApi.get(`/pets/${id}`);
export const addPet = (petData, imageFile) => {
  const formData = new FormData();
  for (const key in petData) {
    formData.append(key, petData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return petpalsApi.post('/pets', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const updatePet = (id, petData, imageFile) => {
  const formData = new FormData();
  for (const key in petData) {
    formData.append(key, petData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile);
  }
  return petpalsApi.put(`/pets/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
export const deletePet = (id) => petpalsApi.delete(`/pets/${id}`);

// --- Application Endpoints ---
export const submitApplication = (applicationData) => petpalsApi.post('/applications', applicationData);
export const getUserApplications = () => petpalsApi.get('/applications/my');
export const getShelterApplications = () => petpalsApi.get('/applications/shelter');
export const updateApplicationStatus = (id, status) => petpalsApi.put(`/applications/${id}/status`, { status });

export default petpalsApi;