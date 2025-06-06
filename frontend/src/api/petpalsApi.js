// frontend/src/api/petpalsApi.js
import axios from 'axios';

// IMPORTANT: Replace with your actual backend URL
// During development, it's often http://127.0.0.1:8000 or http://localhost:8000
const API_BASE_URL = 'http://127.0.0.1:8000/api'; // Or your deployed backend URL

const petpalsApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add the authorization token to every outgoing request
petpalsApi.interceptors.request.use(
    (config) => {
        // Get the token from local storage
        const token = localStorage.getItem('token'); // This key must match what you use in AuthContext.jsx

        // If a token exists, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Optional: Response interceptor for handling 401s globally (e.g., redirect to login)
petpalsApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle 401 Unauthorized errors
            console.warn('Unauthorized request detected. Clearing token and redirecting...');
            localStorage.removeItem('token');
            // You might want to dispatch a logout action or redirect to login here
            // For example, if using React Router:
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


// Define your API functions
export const registerProfile = (profileData) => {
    // This endpoint should be configured on your backend to receive user profile data
    // and ideally link it to the authenticated Firebase user.
    return petpalsApi.post('/auth/register-profile', profileData);
};

export const getProfile = () => {
    // This endpoint should be protected on your backend and return the
    // profile associated with the authenticated user.
    return petpalsApi.get('/auth/profile');
};

// --- Pet Endpoints ---
export const getPets = (filters) => petpalsApi.get('/pets', { params: filters });
export const getPetById = (id) => petpalsApi.get(`/pets/${id}`);
export const addPet = (petData, imageFile) => {
  const formData = new FormData();
  for (const key in petData) {
    formData.append(key, petData[key]);
  }
  if (imageFile) {
    formData.append('image', imageFile); // Changed from 'photo' to 'image'
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
    formData.append('image', imageFile); // Changed from 'photo' to 'image'
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
