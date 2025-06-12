import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CoreAPI from '../../../api/CoreAPI';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiDollarSign, 
  FiTag, 
  FiClock, 
  FiEdit2, 
  FiFileText, 
  FiShare2,
  FiCheckCircle,
  FiAlertCircle,
  FiClock as FiPending,
  FiXCircle,
  FiCopy,
  FiTrash2
} from 'react-icons/fi';
import LoadingSkeleton from '../../../components/common/LoadingSkeleton';
import ErrorMessage from '../../../components/common/ErrorMessage';
import { useDispatch } from 'react-redux';

const ViewProject = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [copied, setCopied] = useState(false);
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.15
      }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const cardVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    hover: { y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    tap: { scale: 0.98 }
  };
  
  // Helper functions
  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <FiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <FiClock className="h-5 w-5 text-blue-500" />;
      case 'pending':
        return <FiPending className="h-5 w-5 text-yellow-500" />;
      case 'cancelled':
        return <FiXCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FiAlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard!');
  };

  // Get project data from API
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await CoreAPI.get_project(projectId);
        
        if (response.status === 'success' && response.data) {
          setProject(response.data);
        } else {
          setError('Failed to load project data');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(err.message || 'Failed to load project');
        setLoading(false);
        toast.error('Error loading project data');
      }
    };
    
    fetchProject();
  }, [projectId]);
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/dashboard/projects');
  };

  if (loading) {
    return <LoadingSkeleton type="project" />;
  }

  if (error) {
    return <ErrorMessage message={error} onBack={handleBack} />;
  }

  return (
    <motion.div 
      className="space-y-6 pb-10"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Project Header */}
      <motion.div 
        className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm relative overflow-hidden"
        variants={itemVariants}
        whileHover={{ boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      >
        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform rotate-45">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
          </svg>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between relative z-10">
          <div className="flex items-center mb-4 sm:mb-0">
            <button 
              onClick={handleBack}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Go back"
            >
              <FiArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{project.title}</h1>
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center
                  ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  <span className="ml-1">{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 border border-gray-200 text-xs font-medium flex items-center">
                  <FiTag className="mr-1" /> {project.platform}
                </span>
                <span className="text-sm text-gray-500 flex items-center">
                  <FiClock className="mr-1 h-4 w-4" /> Updated {new Date(project.updated_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => copyToClipboard(`Project: ${project.title}\nBudget: $${project.budget}\nPlatform: ${project.platform}\nStatus: ${project.status}`)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Share project details"
            >
              <FiShare2 className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          variants={itemVariants}
        >
          {/* Content Tabs */}
          <motion.div 
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('description')}
                className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${activeTab === 'description' 
                  ? 'text-emerald-600 border-b-2 border-emerald-500' 
                  : 'text-gray-600 hover:text-emerald-500'}`}
              >
                <FiFileText className="mr-2 h-4 w-4" />
                Description
              </button>
              {project.summary && (
                <button
                  onClick={() => setActiveTab('summary')}
                  className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${activeTab === 'summary' 
                    ? 'text-emerald-600 border-b-2 border-emerald-500' 
                    : 'text-gray-600 hover:text-emerald-500'}`}
                >
                  <FiFileText className="mr-2 h-4 w-4" />
                  Summary
                </button>
              )}
              <button
                onClick={() => setActiveTab('timeline')}
                className={`px-4 py-3 text-sm font-medium flex items-center transition-colors ${activeTab === 'timeline' 
                  ? 'text-emerald-600 border-b-2 border-emerald-500' 
                  : 'text-gray-600 hover:text-emerald-500'}`}
              >
                <FiCalendar className="mr-2 h-4 w-4" />
                Timeline
              </button>
            </div>
            
            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'description' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="prose max-w-none"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{project.description}</p>
                </motion.div>
              )}
              
              {activeTab === 'summary' && project.summary && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="prose max-w-none"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Summary</h2>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <p className="text-gray-700">{project.summary}</p>
                  </div>
                </motion.div>
              )}
              
              {activeTab === 'timeline' && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Project Timeline</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FiCalendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">Start Date</h3>
                        <p className="text-sm text-gray-500">{new Date(project.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <FiCalendar className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-gray-900">End Date</h3>
                        <p className="text-sm text-gray-500">
                          {project.end_date ? 
                            new Date(project.end_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 
                            'Ongoing'}
                        </p>
                      </div>
                    </div>
                    
                    {project.start_date && project.end_date && (
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <FiClock className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-sm font-medium text-gray-900">Duration</h3>
                          <p className="text-sm text-gray-500">
                            {Math.ceil((new Date(project.end_date) - new Date(project.start_date)) / (1000 * 60 * 60 * 24))} days
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Sidebar */}
        <motion.div 
          className="space-y-6"
          variants={itemVariants}
        >
          {/* Project Metadata */}
          <motion.div 
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm overflow-hidden relative"
            variants={cardVariants}
            whileHover="hover"
          >
            {/* Background pattern */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
            
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">Project Details</span>
              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                ID: {project.id}
              </span>
            </h2>
            
            <div className="space-y-5">
              {/* Budget */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                  <FiDollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Budget</h3>
                  <p className="text-lg font-semibold text-emerald-600">${project.budget}</p>
                </div>
              </div>
              
              {/* Platform */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <FiTag className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Platform</h3>
                  <p className="text-base font-medium text-gray-900">{project.platform}</p>
                </div>
                <div className="ml-auto">
                  <button 
                    onClick={() => copyToClipboard(project.platform)}
                    className="p-1 rounded-full hover:bg-gray-200 transition-colors focus:outline-none"
                    aria-label="Copy platform name"
                  >
                    <FiCopy className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
              </div>
              
              {/* Created At */}
              <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <FiClock className="h-5 w-5 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-800">Created</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(project.created_at).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Project Actions */}
          <motion.div 
            className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
            variants={cardVariants}
            whileHover="hover"
          >
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => navigate(`/dashboard/projects/edit/${project.id}`)}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center justify-center"
              >
                <FiEdit2 className="mr-2 h-4 w-4" /> Edit Project
              </button>
              <button 
                onClick={() => navigate('/dashboard/proposals/create', { state: { projectId: project.id } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 flex items-center justify-center"
              >
                <FiFileText className="mr-2 h-4 w-4" /> Create Proposal
              </button>
              <div className="pt-2 mt-2 border-t border-gray-200">
                <button 
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this project?')) {
                      // Here we would dispatch delete action
                      navigate('/dashboard/projects');
                    }
                  }}
                  className="w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center"
                >
                  <FiTrash2 className="mr-2 h-4 w-4" /> Delete Project
                </button>
              </div>
            </div>
          </motion.div>

          {/* Related Content */}
          {project.related_proposals && project.related_proposals.length > 0 && (
            <motion.div 
              className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm"
              variants={cardVariants}
              whileHover="hover"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Proposals</h2>
              <div className="space-y-3">
                {project.related_proposals.map(proposal => (
                  <div 
                    key={proposal.id} 
                    className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/dashboard/proposals/view/${proposal.id}`)}
                  >
                    <p className="font-medium text-gray-900 truncate">{proposal.title}</p>
                    <p className="text-sm text-gray-500">{new Date(proposal.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ViewProject;
