import { createSlice } from "@reduxjs/toolkit";


const profileData = JSON.parse(localStorage.getItem('profile_data'));
const isRawSubmitted = localStorage.getItem('is_raw_submitted');

const initialState = {
    profile_data: profileData,
    is_raw_submitted: isRawSubmitted,
}

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfileData: (state, action) => {
            state.profile_data = action.payload;
        },
        setIsRawSubmitted: (state, action) => {
            state.is_raw_submitted = action.payload;
        },

        resetProfileData: (state) => {
            state.profile_data = null;
            state.is_raw_submitted = false;

            localStorage.removeItem('profile_data');
            localStorage.removeItem('is_raw_submitted');
        },
    }
})

export default profileSlice.reducer

export const { setProfileData, setIsRawSubmitted, resetProfileData } = profileSlice.actions
