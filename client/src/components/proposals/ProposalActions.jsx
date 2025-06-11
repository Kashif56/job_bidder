import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSend, FiTrash2, FiCheck, FiX, FiLoader } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProposal, deleteProposal } from '../../redux/slices/ProposalSlice';
import { toast } from 'react-toastify';
import ProposalAPI from '../../api/ProposalAPI';

const ProposalActions = ({ proposal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle status change
  const handleStatusChange = async (newStatus) => {
    setIsLoading(true);
    
    try {
      // Update in the backend first
      const response = await ProposalAPI.update_proposal(proposal.id, {
        status: newStatus
      });
      
      if (response.status === 'success') {
        // If backend update successful, update Redux store
        dispatch(updateProposal({
          id: proposal.id,
          status: newStatus
        }));
        
        toast.success(`Proposal marked as ${newStatus}`);
      } else {
        toast.error('Failed to update proposal status');
      }
    } catch (error) {
      console.error('Error updating proposal status:', error);
      toast.error(error.message || 'Failed to update proposal status');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle delete proposal
  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Delete from backend first
      const response = await ProposalAPI.delete_proposal(proposal.id);
      
      if (response.status === 'success') {
        // If backend delete successful, update Redux store
        dispatch(deleteProposal(proposal.id));
        toast.success('Proposal deleted successfully');
        navigate('/dashboard/proposals/all');
      } else {
        toast.error('Failed to delete proposal');
        setConfirmDelete(false);
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      toast.error(error.message || 'Failed to delete proposal');
      setConfirmDelete(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cancel delete confirmation
  const cancelDelete = () => {
    setConfirmDelete(false);
  };

  return (
    <motion.div 
      className="bg-white rounded-lg p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Actions</h2>
      
      <div className="space-y-3">
        {/* Status Actions */}
        <div className="grid grid-cols-1 gap-3">
          {proposal.status !== 'submitted' && (
            <button
              onClick={() => handleStatusChange('submitted')}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiSend className="mr-2" /> Mark as Submitted
                </>
              )}
            </button>
          )}
          
          {proposal.status !== 'accepted' && (
            <button
              onClick={() => handleStatusChange('accepted')}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiCheck className="mr-2" /> Mark as Accepted
                </>
              )}
            </button>
          )}
          
          {proposal.status !== 'rejected' && (
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <FiX className="mr-2" /> Mark as Rejected
                </>
              )}
            </button>
          )}
        </div>
        
        {/* Delete Action */}
        <div className="pt-3 border-t border-gray-200">
          {confirmDelete ? (
            <div className="space-y-3">
              <p className="text-sm text-red-600 font-medium">Are you sure you want to delete this proposal?</p>
              <div className="flex space-x-3">
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="mr-2" /> Confirm Delete
                    </>
                  )}
                </button>
                <button
                  onClick={cancelDelete}
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrash2 className="mr-2" /> Delete Proposal
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalActions;
