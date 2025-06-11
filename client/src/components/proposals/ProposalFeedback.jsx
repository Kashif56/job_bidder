import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSave, FiMessageSquare } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { updateProposal } from '../../redux/slices/ProposalSlice';
import { toast } from 'react-toastify';

const ProposalFeedback = ({ proposal }) => {
  const dispatch = useDispatch();
  const [feedback, setFeedback] = useState(proposal.user_feedback || '');
  const [isEditing, setIsEditing] = useState(false);
  
  // Handle save feedback
  const handleSaveFeedback = () => {
    dispatch(updateProposal({
      id: proposal.id,
      user_feedback: feedback
    }));
    
    setIsEditing(false);
    toast.success('Feedback saved successfully');
  };

  return (
    <motion.div 
      className="bg-white rounded-lg p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center">
          <FiMessageSquare className="mr-2" /> Feedback & Notes
        </h2>
        {isEditing ? (
          <button
            onClick={handleSaveFeedback}
            className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
          >
            <FiSave className="mr-1" /> Save
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {feedback ? 'Edit' : 'Add Feedback'}
          </button>
        )}
      </div>
      
      {isEditing ? (
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Add your feedback, notes, or client response here..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      ) : feedback ? (
        <div className="prose max-w-none">
          {feedback.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3 text-gray-700">
              {paragraph}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 italic">No feedback or notes added yet.</p>
      )}
    </motion.div>
  );
};

export default ProposalFeedback;
