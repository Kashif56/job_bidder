import { createSlice } from "@reduxjs/toolkit";

// Get data from localStorage if available
const profileData = localStorage.getItem('profile_data') ? JSON.parse(localStorage.getItem('profile_data')) : null;
const experiencesData = localStorage.getItem('experiences_data') ? JSON.parse(localStorage.getItem('experiences_data')) : null;
const isRawSubmitted = localStorage.getItem('is_raw_submitted');

const initialState = {
    profile_data: profileData || {},
    experiences_data: experiencesData || [],
    is_raw_submitted: isRawSubmitted || false,
    last_updated: localStorage.getItem('profile_last_updated') || null,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileData: (state, action) => {
            state.profile_data = action.payload;
            state.last_updated = new Date().toISOString();
            localStorage.setItem('profile_data', JSON.stringify(action.payload));
            localStorage.setItem('profile_last_updated', state.last_updated);
        },
        setExperiencesData: (state, action) => {
            state.experiences_data = action.payload;
            localStorage.setItem('experiences_data', JSON.stringify(action.payload));
        },
        setIsRawSubmitted: (state, action) => {
            state.is_raw_submitted = action.payload;
            localStorage.setItem('is_raw_submitted', JSON.stringify(action.payload));
        },
        resetProfileData: (state) => {
            state.profile_data = {};
            state.experiences_data = [];
            state.is_raw_submitted = false;
            state.last_updated = null;

            localStorage.removeItem('profile_data');
            localStorage.removeItem('experiences_data');
            localStorage.removeItem('is_raw_submitted');
            localStorage.removeItem('profile_last_updated');
        },
    }
})

export const { setProfileData, setExperiencesData, setIsRawSubmitted, resetProfileData } = profileSlice.actions;
export default profileSlice.reducer;
