import axiosInstance from "./axiosInstance";

const CoreAPI = {

    create_freelancer_profile: async (userData) => {
        try {
            
            // Let the axiosInstance handle the Authorization header automatically
            const response = await axiosInstance.post('/create_freelancer_profile/', userData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to create freelancer profile' };
        }
    },

    get_freelancer_profile: async () => {
        try {
            const response = await axiosInstance.get('/get_freelancer_profile/');
            console.log(response.data);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to get freelancer profile' };
        }
    },
    
    update_freelancer_profile: async (profileData) => {
        try {
            const response = await axiosInstance.put('/update_freelancer_profile/', profileData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to update freelancer profile' };
        }
    },

    // Work Experience API methods
    create_experience: async (experienceData) => {
        try {
            const response = await axiosInstance.post('/create_experience/', experienceData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to create experience' };
        }
    },

    update_experience: async (experienceId, experienceData) => {
        try {
            const response = await axiosInstance.put(`/update_experience/${experienceId}/`, experienceData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to update experience' };
        }
    },

    delete_experience: async (experienceId) => {
        try {
            const response = await axiosInstance.delete(`/delete_experience/${experienceId}/`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to delete experience' };
        }
    },

    get_experiences: async () => {
        try {
            const response = await axiosInstance.get('/get_experiences/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to get experiences' };
        }
    }
}


export default CoreAPI;
