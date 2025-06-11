import axiosInstance from "./axiosInstance";

const DashboardAPI = {
    // Get all dashboard data in a single request
    getDashboardData: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/data/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to fetch dashboard data' };
        }
    },
    
    // Get dashboard statistics
    getStats: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/stats/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to fetch dashboard stats' };
        }
    },
    
    // Get recent proposals
    getRecentProposals: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/proposals/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to fetch recent proposals' };
        }
    },
    
    // Get job opportunities
    getJobOpportunities: async () => {
        try {
            const response = await axiosInstance.get('/dashboard/opportunities/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to fetch job opportunities' };
        }
    }
};

export default DashboardAPI;
