import axiosInstance from './axiosInstance';

const AuthAPI = {

    register: async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register/', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Registration failed' };
        }
    },


    login: async (credentials) => {
        try {
            const response = await axiosInstance.post('/auth/login/', credentials);
          
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Login failed' };
        }
    },


    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
    },

 
    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },


    getCurrentUser: async () => {
        try {
            const response = await axiosInstance.get('/auth/profile/');
            return response.data;
        } catch (error) {
            throw error.response?.data || { error: 'Failed to fetch user data' };
        }
    },
};

export default AuthAPI;
