import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiExternalLink, FiFileText, FiClock, FiDollarSign } from 'react-icons/fi';
import { motion } from 'framer-motion';
import CoreAPI from '../../api/CoreAPI';
import {toast} from 'react-toastify'

import { useSelector, useDispatch } from 'react-redux';
import { setProjects, addProject, updateProject, removeProject, setLoading, setError } from '../../redux/slices/ProjectsSlice';


const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get projects from Redux state
  const { projects, loading, error, last_updated } = useSelector(state => state.projects);
  
  
  // Fetch projects if not available in Redux state
  useEffect(() => {
    const shouldFetchData = !projects.length || !last_updated;
    
    if (shouldFetchData) {
      dispatch(setLoading(true));
      
      CoreAPI.get_projects()
        .then(response => {
         
          if (response.status === 'success' && response.data.length > 0) {
            dispatch(setProjects(response.data));
          }
          
          dispatch(setLoading(false));
        })
        .catch(err => {
          console.error('Error fetching projects:', err);
          dispatch(setError(err.message || 'Failed to fetch projects'));
          dispatch(setLoading(false));
        });
    }
  }, [dispatch, projects.length, last_updated]);

  // Filter projects based on active tab and search term
  const filteredProjects = projects.filter(project => {
    // Skip invalid projects
    if (!project || typeof project !== 'object') return false;
    
    // Check if project matches the active tab
    const matchesTab = activeTab === 'all' || 
                      (project.status ? project.status === activeTab : true);
    
    // Check if project matches the search term
    const matchesSearch = searchTerm === '' || (
      (project.title ? project.title.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
      (project.client ? project.client.toString().toLowerCase().includes(searchTerm.toLowerCase()) : false)
    );
    
    return matchesTab && matchesSearch;
  });

 

  // Handle delete project
  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (projectToDelete && projectToDelete.id) {
      dispatch(setLoading(true));

      const response = await CoreAPI.delete_project(projectToDelete.id);
      console.log(response);
      
      if (response.status === 'success') {
        dispatch(removeProject({ id: projectToDelete.id }));
        toast.success('Project deleted successfully');
      }
      else {
        toast.error('Failed to delete project');
      }
      
      dispatch(setLoading(false));
    }
    setShowDeleteModal(false);
    setProjectToDelete(null);
  };
  



  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <p className="mt-1 text-gray-600">
              Manage your client projects and track progress
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button 
              onClick={() => navigate('/dashboard/projects/add')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <FiPlus className="-ml-1 mr-2 h-5 w-5" />
              New Project
            </button>
          </div>
        </div>
      </div>


      {/* Project stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          className="bg-white rounded-lg p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
              <FiFileText className="h-6 w-6" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">{projects.length}</div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
              <FiClock className="h-6 w-6" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => p.status === 'active').length}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-lg p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-md bg-emerald-100 text-emerald-600">
              <FiExternalLink className="h-6 w-6" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Completed Projects</dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {projects.filter(p => p.status === 'completed').length}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </motion.div>


      </div>

      {/* Tabs and search */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'all'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Projects
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'completed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed
              </button>
            </div>
            <div className="relative max-w-xs w-full md:max-w-sm">
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        

        {/* Projects grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:bg-gray-50 transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900 truncate" title={project.title}>
                      {project.title}
                    </h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      project.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {project.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600 truncate" title={project.client}>
                    {project.client}
                  </p>
                </div>
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-500">Start Date</div>
                      <div className="font-medium text-gray-900">{project.start_date}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">End Date</div>
                      <div className="font-medium text-gray-900">{project.end_date}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Budget</div>
                      <div className="font-medium text-gray-900">{project.budget}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Platform</div>
                      <div className="font-medium text-gray-900">{project.platform}</div>
                    </div>
                  </div>
                  
                  {project.status === 'active' && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-gray-500">Progress</div>
                        <div className="font-medium text-gray-900">{project.progress}%</div>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </div>
                </div>
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-between">
                  <div className="flex space-x-2 mt-4">
                    <button
                      onClick={() => navigate(`/dashboard/projects/view/${project.id}`)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <FiExternalLink className="mr-1" />
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <FiEdit2 className="mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(project)}
                      className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <FiTrash2 className="mr-1" />
                      Delete
                    </button>
                  </div>
                  <div>
                    {project.proposalId && (
                      <Link
                        to={`/dashboard/proposals/${project.proposalId}`}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-emerald-600 hover:text-emerald-800"
                      >
                        <FiFileText className="mr-1 h-3 w-3" />
                        View Proposal
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              {loading ? (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500">
                  <p>Error loading projects: {error}</p>
                  <button 
                    onClick={() => dispatch(fetchProjects())}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <>
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating a new project.'}
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                      onClick={() => {
                        navigate('/dashboard/projects/add');
                      }}
                    >
                      <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                      New Project
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Project</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the project "{projectToDelete?.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
