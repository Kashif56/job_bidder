import axiosInstance from "./axiosInstance";

const ProposalAPI = {
    // Create a new proposal
    create_proposal: async (formData) => {
        try {
            // Let the axiosInstance handle the Authorization header automatically
            const response = await axiosInstance.post('/proposals/create/', formData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to create proposal' };
        }
    },
    
    // Get all proposals for the current user
    get_proposals: async () => {
        try {
            const response = await axiosInstance.get('/proposals/');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to fetch proposals' };
        }
    },
    
    // Get a specific proposal by ID
    get_proposal: async (proposalId) => {
        try {
            const response = await axiosInstance.get(`/proposals/${proposalId}/`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to fetch proposal' };
        }
    },
    
    // Update a proposal
    update_proposal: async (proposalId, updateData) => {
        try {
            const response = await axiosInstance.patch(`/proposals/${proposalId}/update/`, updateData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to update proposal' };
        }
    },
    
    // Delete a proposal
    delete_proposal: async (proposalId) => {
        try {
            const response = await axiosInstance.delete(`/proposals/${proposalId}/delete/`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to delete proposal' };
        }
    },
    
    // Analyze job match
    analyze_job_match: async (jobDescription) => {
        try {
            const response = await axiosInstance.post('/proposals/job-match/analyze/', {
                job_description: jobDescription
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to analyze job match' };
        }
    },
    
    // Multi-step proposal generation
    analyze_pain_points: async (jobDescription) => {
        try {
            const response = await axiosInstance.post('/proposals/generate/pain-points/', {
                job_description: jobDescription
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to analyze pain points' };
        }
    },
    
    generate_targeted_proposal: async (jobDescription, painPoints, style = 'default', strategy = '') => {
        try {
            const response = await axiosInstance.post('/proposals/generate/targeted-proposal/', {
                job_description: jobDescription,
                pain_points: painPoints,
                style: style,
                strategy: strategy
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to generate targeted proposal' };
        }
    },
    
    humanize_proposal: async (proposalText, jobDescription) => {
        try {
            const response = await axiosInstance.post('/proposals/generate/humanize/', {
                proposal_text: proposalText,
                job_description: jobDescription
            });
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error.response?.data || { error: 'Failed to humanize proposal' };
        }
    }
};

export default ProposalAPI;