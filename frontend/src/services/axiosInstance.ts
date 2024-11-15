import axios from 'axios';

// Extract CSRF token from cookies
const getCsrfToken = () => {
  if(typeof window != 'undefined'){
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
  }
  return null;
}

// Create an Axios instance with a base URL for the backend API
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,  // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Dynamically inject CSRF token in every request
api.interceptors.request.use(
  (config) => {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      config.headers['X-CSRF-Token'] = csrfToken; // Add CSRF token to headers
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const response = await api.post('/auth/refreshToken/');  // Send request to refresh token
          isRefreshing = false;
          onRefreshed(response.data.access_token);  // Notify subscribers with new token
        } catch (refreshError) {
          isRefreshing = false;
          return Promise.reject(refreshError);  // Return if refresh fails
        }
      }

      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          resolve(axios(originalRequest));
        });
      });
    }
    return Promise.reject(error);
  }
);


// Fetch CSRF token from backend
export const fetchCSRF = async () => {
  try {
    const response = await api.get('/auth/csrf-token'); // Adjust endpoint as needed
    console.log('CSRF Token fetched:', response.data.csrfToken);
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
  }
};

export default api;