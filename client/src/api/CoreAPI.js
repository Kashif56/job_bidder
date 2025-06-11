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
    },

    create_project: async (projectData) => {
        try {
            const response = await axiosInstance.post('/create_project/', projectData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to create project' };
        }
    },

    get_projects: async () => {
        try {
            const response = await axiosInstance.get('/get_projects/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to get projects' };
        }
    },

    get_project: async (projectId) => {
        try {
            const response = await axiosInstance.get(`/get_project/${projectId}/`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to get project' };
        }
    },

    update_project: async (projectId, projectData) => {
        try {
            const response = await axiosInstance.put(`/update_project/${projectId}/`, projectData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to update project' };
        }
    },

    delete_project: async (project_id) => {
        try {
            const response = await axiosInstance.get(`/delete_project/${project_id}/`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to get project' };
        }
    }
}


export default CoreAPI;
