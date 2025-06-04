import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/AuthSlice';
import profileReducer from './slices/ProfileSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer,
    },
});

export default store;
