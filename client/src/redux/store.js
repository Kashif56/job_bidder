import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import profileReducer from './slices/ProfileSlice';
import projectsReducer from './slices/ProjectsSlice';
import proposalsReducer from './slices/ProposalSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
        projects: projectsReducer,
        proposals: proposalsReducer,
    },
});

export default store;
