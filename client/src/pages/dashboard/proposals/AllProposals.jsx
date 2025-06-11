import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiCopy, FiDownload, FiFilter, FiSearch, FiChevronDown, FiEye, FiRefreshCw } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import ProposalAPI from '../../../api/ProposalAPI';
import { setProposals } from '../../../redux/slices/ProposalSlice';

const AllProposals = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { proposals, last_updated } = useSelector((state) => state.proposals);
  
  // Ensure proposals is always an array
  const proposalsArray = Array.isArray(proposals) ? proposals : (proposals ? [proposals] : []);
  
  // Function to check if data needs to be refreshed (older than 3 hours)
  const needsRefresh = () => {
    if (!last_updated) return true;
    
    const lastUpdatedTime = new Date(last_updated).getTime();
    const currentTime = new Date().getTime();
    const threeHoursInMs = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
    
    return (currentTime - lastUpdatedTime) > threeHoursInMs;
  };
  
  // Function to fetch proposals from the backend
  const fetchProposals = async (forceRefresh = false) => {
    // If we have proposals and they're recent enough, use the cached data
    if (!forceRefresh && proposalsArray.length > 0 && !needsRefresh()) {
      return;
    }
    
    if (forceRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await ProposalAPI.get_proposals();
      
      if (response.status === 'success' && response.proposals) {
        // Update Redux store with fresh data from the API
        dispatch(setProposals(response.proposals));
        console.log(response.proposals);
        
        if (forceRefresh) {
          toast.success('Proposals refreshed successfully');
        }
      } else {
        toast.error('Failed to load proposals');
      }
    } catch (error) {
      console.error('Error fetching proposals:', error);
      toast.error(error.message || 'Failed to load proposals');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Fetch proposals when component mounts or when needed
  useEffect(() => {
    fetchProposals();
  }, []);
  
  // Manual refresh handler
  const handleRefresh = () => {
    fetchProposals(true);
  };

  const filteredProposals = proposalsArray
    .filter(proposal => {
      // Filter by search term
      const matchesSearch = 
        (proposal.job_description && proposal.job_description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (proposal.style && proposal.style.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (proposal.username && proposal.username.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || 
        (proposal.status && proposal.status.toLowerCase() === filterStatus.toLowerCase());
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.created_at || 0) - new Date(b.created_at || 0)
          : new Date(b.created_at || 0) - new Date(a.created_at || 0);
      } else if (sortBy === 'style') {
        return sortOrder === 'asc'
          ? (a.style || '').localeCompare(b.style || '')
          : (b.style || '').localeCompare(a.style || '');
      } else if (sortBy === 'status') {
        return sortOrder === 'asc'
          ? (a.status || '').localeCompare(b.status || '')
          : (b.status || '').localeCompare(a.status || '');
      }
      return 0;
    });

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Get color for status badge
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'generated':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  // Calculate word count from proposal text
  const getWordCount = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).length;
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">All Proposals</h1>
            <p className="mt-1 text-gray-600">
              Manage and track all your proposals in one place
              {last_updated && (
                <span className="text-xs text-gray-400 ml-2">
                  Last updated: {formatDate(last_updated)}
                </span>
              )}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {refreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <FiRefreshCw className="-ml-1 mr-2 h-4 w-4" />
                  Refresh
                </>
              )}
            </button>
            <Link
              to="/dashboard/proposals/generate"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              Generate New Proposal
            </Link>
          </div>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white sm:text-sm"
                placeholder="Search proposals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <FiFilter className="mr-2 h-4 w-4" />
                Filters
                <FiChevronDown className={`ml-1 h-4 w-4 transition-transform ${showFilters ? 'transform rotate-180' : ''}`} />
              </button>
              <div className="relative inline-block text-left">
                <select
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="platform">Sort by Platform</option>
                </select>
              </div>
              <button
                onClick={toggleSortOrder}
                className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <motion.div 
              className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div>
                <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="won">Won</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div>
                <label htmlFor="platform-filter" className="block text-sm font-medium text-gray-700 mb-1">
                  Platform
                </label>
                <select
                  id="platform-filter"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                >
                  <option value="all">All Platforms</option>
                  <option value="upwork">Upwork</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="fiverr">Fiverr</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">
                  Date From
                </label>
                <input
                  type="date"
                  id="date-from"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                />
              </div>
              <div>
                <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">
                  Date To
                </label>
                <input
                  type="date"
                  id="date-to"
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Proposals list */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      setSortBy('date');
                      toggleSortOrder();
                    }}
                  >
                    <div className="flex items-center">
                      Date
                      {sortBy === 'date' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => {
                      setSortBy('status');
                      toggleSortOrder();
                    }}
                  >
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <span className="ml-1">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Length
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  // Loading state
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center">
                      <div className="flex justify-center items-center space-x-2">
                        <svg className="animate-spin h-5 w-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="text-sm font-medium text-gray-500">Loading proposals...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredProposals.length > 0 ? (
                  filteredProposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(proposal.created_at)}
                      </td>
                 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
                          {proposal.style?.toUpperCase() || 'Generated'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                        {proposal.job_description ? proposal.job_description.substring(0, 100) + '...' : 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {proposal.proposal_text ? getWordCount(proposal.proposal_text) + ' words' : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <Link to={`/dashboard/proposals/view/${proposal.id}`} className="text-gray-400 hover:text-blue-600" title="View Details">
                            <FiEye className="h-4 w-4" />
                          </Link>
                          <button className="text-gray-400 hover:text-emerald-600" title="Copy">
                            <FiCopy className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-emerald-600" title="Download">
                            <FiDownload className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-emerald-600" title="Edit">
                            <FiEdit2 className="h-4 w-4" />
                          </button>
                          <button className="text-gray-400 hover:text-red-600" title="Delete">
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                      {proposalsArray.length === 0 ? 'No proposals found. Create your first proposal!' : 'No proposals found matching your filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProposals.length}</span> of{' '}
                <span className="font-medium">{filteredProposals.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Previous</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-emerald-50 text-sm font-medium text-emerald-600"
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  <span className="sr-only">Next</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProposals;
