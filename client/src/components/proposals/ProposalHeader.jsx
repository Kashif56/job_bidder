import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const ProposalHeader = ({ proposal, onBack, variants }) => {
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg p-6 border border-gray-200"
      variants={variants}
    >
      <div className="flex flex-col space-y-4">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <FiArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Proposal Details</h1>
            <p className="mt-1 text-gray-600">
              Created on {formatDate(proposal.created_at)}
            </p>
          </div>
        </div>
        
        <div className="mt-2">
          <h2 className="text-xl font-semibold text-gray-700">
            Job Description
          </h2>
          <p className="mt-2 text-gray-600 line-clamp-3">
            {proposal.job_description}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3 mt-2">
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium">
            Style: {proposal.style || 'Default'}
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            Status: {proposal.status || 'Generated'}
          </div>
          {proposal.proposal_text && (
            <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              {proposal.proposal_text.trim().split(/\s+/).length} words
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalHeader;
