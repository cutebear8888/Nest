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
    if(response.data.success){
      console.log('CSRF Token fetched:', response.data.csrfToken);
    } else {
      console.log('CSRF TOKEN UNFETCHED');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The server responded with a status code that falls out of the range of 2xx
        console.log('Error fetching CSRF token:', error.response.data);  // Log error response from server
        console.log('Error status:', error.response.status);  // Log the status code
        
        // Handle different types of HTTP errors (e.g., 500, 401, etc.)
        if (error.response.status === 500) {
          console.log('Server error while fetching CSRF token.');
        } else if (error.response.status === 401) {
          console.log('Unauthorized: You need to be logged in to fetch the CSRF token.');
        } else {
          console.log('An unexpected error occurred while fetching the CSRF token.');
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received from the server while fetching CSRF token.');
      } else {
        // Something happened in setting up the request
        console.log('Error setting up the request to fetch CSRF token:', error.message);
      }
    } else {
      console.log('Unexpected error occurred:', error);
    }
  }
};

export default api;