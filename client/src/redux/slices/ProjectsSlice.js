import { createSlice } from '@reduxjs/toolkit';



const projectsData = localStorage.getItem('projects_data') ? JSON.parse(localStorage.getItem('projects_data')) : [];



const initialState = {
    projects: projectsData,
    loading: false,
    error: null,
    last_updated: localStorage.getItem('projects_last_updated') || null,
}



const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        setProjects: (state, action) => {
            state.projects = action.payload;
            state.last_updated = new Date().toISOString();
            localStorage.setItem('projects_data', JSON.stringify(action.payload));
            localStorage.setItem('projects_last_updated', state.last_updated);
        },
        removeProject: (state, action) => {
            state.projects = state.projects.filter(project => project.id !== action.payload.id);
            localStorage.setItem('projects_data', JSON.stringify(state.projects));
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addProject: (state, action) => {
            const currentProjects = Array.isArray(state.projects) ? state.projects : [];
            state.projects = [...currentProjects, action.payload];
            localStorage.setItem('projects_data', JSON.stringify(state.projects));
        },
        updateProject: (state, action) => {
            const updatedProject = action.payload;
            state.projects = state.projects.map(project => 
                project.id === updatedProject.id ? updatedProject : project
            );
            localStorage.setItem('projects_data', JSON.stringify(state.projects));
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        resetProjects: (state) => {
            state.projects = [];
            state.loading = false;
            state.error = null;
            state.last_updated = null;
            
            localStorage.removeItem('projects_data');
            localStorage.removeItem('projects_last_updated');
        },
    },
})

export const { setProjects, removeProject, addProject, updateProject, setLoading, setError, resetProjects } = projectsSlice.actions;
export default projectsSlice.reducer;
