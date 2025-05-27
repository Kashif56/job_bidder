import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiCopy, FiDownload, FiFilter, FiSearch, FiChevronDown } from 'react-icons/fi';
import { motion } from 'framer-motion';

const AllProposals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Sample proposal data
  const proposals = [
    {
      id: 'prop-001',
      title: 'React Developer for E-commerce Project',
      platform: 'Upwork',
      client: 'TechSolutions Inc.',
      date: '2023-05-25',
      status: 'Submitted',
      statusColor: 'bg-blue-100 text-blue-800',
      budget: '$2,000 - $3,000',
      excerpt: `I'm writing to express my strong interest in your React Developer position...`
    },
    {
      id: 'prop-002',
      title: 'UX/UI Designer for Mobile App',
      platform: 'Freelancer',
      client: 'AppWorks Studio',
      date: '2023-05-24',
      status: 'Won',
      statusColor: 'bg-green-100 text-green-800',
      budget: '$1,500 - $2,500',
      excerpt: 'As a UX/UI designer with 5+ years of experience creating intuitive mobile interfaces...'
    },
    {
      id: 'prop-003',
      title: 'WordPress Website Development',
      platform: 'Fiverr',
      client: 'Local Business',
      date: '2023-05-22',
      status: 'Rejected',
      statusColor: 'bg-red-100 text-red-800',
      budget: '$800 - $1,200',
      excerpt: `I noticed your request for a WordPress website developer and I'm confident I can deliver...`
    },
    {
      id: 'prop-004',
      title: 'Content Writing for SaaS Blog',
      platform: 'Upwork',
      client: 'SaaS Growth Co.',
      date: '2023-05-20',
      status: 'Draft',
      statusColor: 'bg-gray-100 text-gray-800',
      budget: '$500 - $800',
      excerpt: 'With my background in SaaS marketing and content strategy, I can help you create...'
    },
    {
      id: 'prop-005',
      title: 'Social Media Marketing Campaign',
      platform: 'LinkedIn',
      client: 'Fashion Brand',
      date: '2023-05-18',
      status: 'Won',
      statusColor: 'bg-green-100 text-green-800',
      budget: '$1,800 - $2,200',
      excerpt: `I've helped several fashion brands increase their social media engagement by over 200%...`
    },
    {
      id: 'prop-006',
      title: 'Logo Design for Tech Startup',
      platform: 'Dribbble',
      client: 'AI Startup',
      date: '2023-05-15',
      status: 'Submitted',
      statusColor: 'bg-blue-100 text-blue-800',
      budget: '$400 - $600',
      excerpt: 'I specialize in creating modern, memorable logos for tech companies that convey...'
    }
  ];

  // Filter and sort proposals
  const filteredProposals = proposals
    .filter(proposal => {
      // Filter by search term
      const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proposal.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           proposal.platform.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const matchesStatus = filterStatus === 'all' || proposal.status.toLowerCase() === filterStatus.toLowerCase();
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'title') {
        return sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortBy === 'platform') {
        return sortOrder === 'asc'
          ? a.platform.localeCompare(b.platform)
          : b.platform.localeCompare(a.platform);
      }
      return 0;
    });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
            </p>
          </div>
          <div className="mt-4 md:mt-0">
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProposals.length > 0 ? (
                filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            <Link to={`/dashboard/proposals/${proposal.id}`} className="hover:text-emerald-600">
                              {proposal.title}
                            </Link>
                          </div>
                          <div className="text-sm text-gray-500">{proposal.client}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{proposal.platform}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(proposal.date)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${proposal.statusColor}`}>
                        {proposal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {proposal.budget}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button className="text-gray-400 hover:text-emerald-600" title="Copy">
                          <FiCopy className="h-4 w-4" />
                        </button>
                        <button className="text-gray-400 hover:text-emerald-600" title="Download">
                          <FiDownload className="h-4 w-4" />
                        </button>
                        <Link to={`/dashboard/proposals/edit/${proposal.id}`} className="text-gray-400 hover:text-emerald-600" title="Edit">
                          <FiEdit2 className="h-4 w-4" />
                        </Link>
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
                    No proposals found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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
