import { createSlice } from "@reduxjs/toolkit";

// Initialize proposal data from localStorage or empty array if none exists
const proposalData = localStorage.getItem('proposal_data') ? JSON.parse(localStorage.getItem('proposal_data')) : [];

const initialState = {
    proposals: proposalData,
    loading: false,
    error: null,
    last_updated: localStorage.getItem('proposal_last_updated') || null,
}

const proposalSlice = createSlice({
    name: 'proposal',
    initialState,
    reducers: {
        // Replace proposals state with data from backend
        setProposals: (state, action) => {
            // When refreshing from backend, completely replace the state
            // Ensure action.payload is always an array
            state.proposals = Array.isArray(action.payload) ? action.payload : [action.payload];
            
            // Update timestamp
            state.last_updated = new Date().toISOString();
            
            // Update localStorage
            localStorage.setItem('proposal_data', JSON.stringify(state.proposals));
            localStorage.setItem('proposal_last_updated', state.last_updated);
        },
        
        // Update an existing proposal by ID
        updateProposal: (state, action) => {
            // Ensure state.proposals is always an array
            if (!Array.isArray(state.proposals)) {
                state.proposals = state.proposals ? [state.proposals] : [];
            }
            
            const { id, ...updatedFields } = action.payload;
            
            // Find and update the proposal
            const index = state.proposals.findIndex(proposal => proposal && proposal.id === id);
            if (index !== -1) {
                state.proposals[index] = { ...state.proposals[index], ...updatedFields };
                state.last_updated = new Date().toISOString();
                
                // Update localStorage
                localStorage.setItem('proposal_data', JSON.stringify(state.proposals));
                localStorage.setItem('proposal_last_updated', state.last_updated);
            }
        },
        
        // Delete a proposal by ID
        deleteProposal: (state, action) => {
            // Ensure state.proposals is always an array
            if (!Array.isArray(state.proposals)) {
                state.proposals = state.proposals ? [state.proposals] : [];
                return; // If it wasn't an array, after converting it, just return
            }
            
            state.proposals = state.proposals.filter(proposal => proposal && proposal.id !== action.payload);
            state.last_updated = new Date().toISOString();
            
            // Update localStorage
            localStorage.setItem('proposal_data', JSON.stringify(state.proposals));
            localStorage.setItem('proposal_last_updated', state.last_updated);
        },
        
        // Add a new proposal to the state
        addProposal: (state, action) => {
            // Ensure state.proposals is always an array
            if (!Array.isArray(state.proposals)) {
                state.proposals = state.proposals ? [state.proposals] : [];
            }
            
            // Add the new proposal to the beginning of the array
            state.proposals.unshift(action.payload);
            state.last_updated = new Date().toISOString();
            
            // Update localStorage
            localStorage.setItem('proposal_data', JSON.stringify(state.proposals));
            localStorage.setItem('proposal_last_updated', state.last_updated);
        }
    },
});

export const { setProposals, updateProposal, deleteProposal, addProposal } = proposalSlice.actions;
export default proposalSlice.reducer;
