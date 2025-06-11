import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiSave, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { updateProject, setError, setLoading } from '../../../redux/slices/ProjectsSlice';
import CoreAPI from '../../../api/CoreAPI';
import { toast } from 'react-toastify';

const EditProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get projects from Redux state
  const { projects } = useSelector(state => state.projects);
  
  // Find the project to edit
  const projectToEdit = Array.isArray(projects) 
    ? projects.find(project => project.id === parseInt(projectId, 10))
    : null;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    platform: 'upwork',
    status: 'pending',
    start_date: '',
    end_date: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const platformOptions = [
    { value: 'upwork', label: 'Upwork' },
    { value: 'fiverr', label: 'Fiverr' },
    { value: 'freelancer', label: 'Freelancer' },
    { value: 'direct_client', label: 'Direct Client' }
  ];
  
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];
  
  // Load project data when component mounts
  useEffect(() => {
    if (projectToEdit) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        title: projectToEdit.title || '',
        description: projectToEdit.description || '',
        budget: projectToEdit.budget || '',
        platform: projectToEdit.platform || 'upwork',
        status: projectToEdit.status || 'pending',
        start_date: projectToEdit.start_date ? formatDate(projectToEdit.start_date) : '',
        end_date: projectToEdit.end_date ? formatDate(projectToEdit.end_date) : ''
      });
      setIsLoading(false);
    } else if (projectId) {
      // If project is not in Redux state, fetch it from API
      CoreAPI.get_project(projectId)
        .then(response => {
          const project = response.data;
          
          // Format dates for input fields (YYYY-MM-DD)
          const formatDate = (dateString) => {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
          };
          
          setFormData({
            title: project.title || '',
            description: project.description || '',
            budget: project.budget || '',
            platform: project.platform || 'upwork',
            status: project.status || 'pending',
            start_date: project.start_date ? formatDate(project.start_date) : '',
            end_date: project.end_date ? formatDate(project.end_date) : ''
          });
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error fetching project:', err);
          dispatch(setError(err.message || 'Failed to fetch project'));
          setIsLoading(false);
          // Navigate back to projects list if project not found
          navigate('/dashboard/projects');
        });
    }
  }, [projectId, projectToEdit, dispatch, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'budget' ? (value === '' ? '' : parseInt(value, 10)) : value
    });
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.budget) errors.budget = 'Budget is required';
    if (formData.budget <= 0) errors.budget = 'Budget must be greater than 0';
    if (!formData.start_date) errors.start_date = 'Start date is required';
    if (!formData.end_date) errors.end_date = 'End date is required';
    
    // Check if end date is after start date
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      
      if (endDate < startDate) {
        errors.end_date = 'End date must be after start date';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    dispatch(setLoading(true));
    
    try {
      const response = await CoreAPI.update_project(projectId, formData);
      console.log('Project updated successfully:', response);
      toast.success('Project updated successfully');
      
      // Update project in Redux store
      dispatch(updateProject(response.data));
      dispatch(setLoading(false));
      
      // Navigate back to projects list
      navigate('/dashboard/projects');
    } catch (err) {
      console.error('Error updating project:', err);
      toast.error('Failed to update project');
      dispatch(setError(err.message || 'Failed to update project'));
      dispatch(setLoading(false));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Page header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Edit Project</h1>
            <p className="mt-1 text-gray-600">
              Update your project details and settings
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => navigate('/dashboard/projects')}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FiX className="-ml-0.5 mr-2 h-4 w-4" /> Close
            </button>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {/* Project Details */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Project Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm ${formErrors.title ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder="Project title"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
              
              {/* Budget */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">
                  Budget (USD) *
                </label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm ${formErrors.budget ? 'border-red-500 bg-red-50' : ''}`}
                  placeholder="Project budget"
                />
                {formErrors.budget && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.budget}</p>
                )}
              </div>
              
              {/* Platform */}
              <div>
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
                  Platform *
                </label>
                <select
                  id="platform"
                  name="platform"
                  value={formData.platform}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                >
                  {platformOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Status */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Dates */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Start Date */}
                <div>
                  <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm ${formErrors.start_date ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  {formErrors.start_date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.start_date}</p>
                  )}
                </div>
                
                {/* End Date */}
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm ${formErrors.end_date ? 'border-red-500 bg-red-50' : ''}`}
                  />
                  {formErrors.end_date && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.end_date}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden p-6 mt-3">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={10}
            value={formData.description}
            onChange={handleChange}
            className={`block w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm ${formErrors.description ? 'border-red-500 bg-red-50' : ''}`}
            placeholder="Describe the project scope, requirements, and objectives"
          />
          {formErrors.description && (
            <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/dashboard/projects')}
            className="mr-3 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
          >
            <FiSave className="-ml-1 mr-2 h-5 w-5" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProject;
