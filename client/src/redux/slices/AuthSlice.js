import { createSlice } from "@reduxjs/toolkit";

const user = JSON.parse(localStorage.getItem('user'));
const access_token = localStorage.getItem('access_token');
const refresh_token = localStorage.getItem('refresh_token');



const initialState = {
    user: user,
    isAuthenticated: !!access_token,
    isLoading: false,
    error: null,
    access_token: access_token,
    refresh_token: refresh_token,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        register: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.access_token = action.payload.tokens.access;
            state.refresh_token = action.payload.tokens.refresh;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('access_token', action.payload.tokens.access);
            localStorage.setItem('refresh_token', action.payload.tokens.refresh);
        },
        login: (state, action) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.access_token = action.payload.tokens.access;
            state.refresh_token = action.payload.tokens.refresh;

            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('access_token', action.payload.tokens.access);
            localStorage.setItem('refresh_token', action.payload.tokens.refresh);
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.access_token = null;
            state.refresh_token = null;

            localStorage.removeItem('user');
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
    }
})

export default authSlice.reducer;
export const { register, login, logout } = authSlice.actions;
