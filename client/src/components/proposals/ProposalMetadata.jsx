import { motion } from 'framer-motion';
import { FiCalendar, FiTag, FiUser, FiClock } from 'react-icons/fi';

const ProposalMetadata = ({ proposal }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-lg p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Metadata</h2>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <FiTag className="h-5 w-5 text-gray-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Status</p>
            <div className={`mt-1 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
              {proposal?.status?.toUpperCase() || 'Generated'}
            </div>
          </div>
        </div>
        
        {/* Style */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <FiTag className="h-5 w-5 text-gray-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Style</p>
            <p className="mt-1 text-sm text-gray-500">{proposal?.style?.toUpperCase() || 'Default'}</p>
          </div>
        </div>
        
        {/* Created By */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <FiUser className="h-5 w-5 text-gray-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Created By</p>
            <p className="mt-1 text-sm text-gray-500">{proposal?.user?.username?.toUpperCase() || 'Unknown User'}</p>
          </div>
        </div>
        
        {/* Created At */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <FiCalendar className="h-5 w-5 text-gray-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Created At</p>
            <p className="mt-1 text-sm text-gray-500">{formatDate(proposal.created_at)}</p>
          </div>
        </div>
        
        {/* Last Updated */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-1">
            <FiClock className="h-5 w-5 text-gray-500" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-700">Last Updated</p>
            <p className="mt-1 text-sm text-gray-500">{formatDate(proposal.updated_at)}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalMetadata;
