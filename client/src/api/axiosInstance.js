import axios from 'axios';


const baseURL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Store to track if token refresh is in progress
let isRefreshing = false;
// Queue of failed requests to retry after token refresh
let failedQueue = [];

// Process failed queue (either resolve or reject based on token refresh result)
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

// Request interceptor - add auth token to requests
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            // Use standard Authorization header with Bearer token
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh on 401 errors
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If refresh already in progress, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => Promise.reject(err));
            }
            
            // Mark that we're now refreshing and this request is a retry
            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refresh_token');
                
                if (!refreshToken) {
                    // No refresh token available, clear auth and reject
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    // Redirect to login page
                    window.location.href = '/login';
                    return Promise.reject(error);
                }
                
                // Call refresh token endpoint
                const response = await axios.post(baseURL + '/token/refresh/', {
                    refresh: refreshToken
                });
                
        
                // If successful, update tokens
                if (response.data) {
                    const { access } = response.data;
                    
                    // Store the new token in localStorage FIRST
                    localStorage.setItem('access_token', access);
                    
                    // Update auth header for original request
                    // Use a new config object to avoid interceptor issues
                    const newConfig = { ...originalRequest };
                    newConfig.headers.Authorization = `Bearer ${access}`;
                    
                    // Process any queued requests with new token
                    processQueue(null, access);
                    
                    // Retry the original request with the new config
                    // Skip the request interceptor by using axios directly
                    return axios(newConfig);
                } else {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                
                // Redirect to login page
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                // Reset refreshing flag
                isRefreshing = false;
            }
        }
        
        // For all other errors, just reject the promise
        return Promise.reject(error);
    }
);

export default axiosInstance;