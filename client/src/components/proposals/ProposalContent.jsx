import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiDownload, FiEdit2, FiCheck, FiLoader } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { updateProposal } from '../../redux/slices/ProposalSlice';
import { toast } from 'react-toastify';
import ProposalAPI from '../../api/ProposalAPI';

const ProposalContent = ({ proposal }) => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(proposal.proposal_text || '');
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Handle copy to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(proposal.proposal_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Handle download as text file
  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([proposal.proposal_text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `proposal-${proposal.id.substring(0, 8)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  // Handle save edited text
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Update in the backend first
      const response = await ProposalAPI.update_proposal(proposal.id, {
        proposal_text: editedText
      });
      
      if (response.status === 'success') {
        // If backend update successful, update Redux store
        dispatch(updateProposal({
          id: proposal.id,
          proposal_text: editedText
        }));
        
        toast.success('Proposal text updated successfully');
        setIsEditing(false);
      } else {
        toast.error('Failed to update proposal text');
      }
    } catch (error) {
      console.error('Error updating proposal text:', error);
      toast.error(error.message || 'Failed to update proposal text');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Calculate word count
  const wordCount = (text) => {
    return text.trim().split(/\s+/).length;
  };
  
  // Calculate character count
  const charCount = (text) => {
    return text.length;
  };

  return (
    <motion.div 
      className="bg-white rounded-lg p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-700">Proposal Text</h2>
        <div className="flex space-x-2">
          {isEditing ? (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <FiCheck className="mr-1" /> Save
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                <FiEdit2 className="mr-1" /> Edit
              </button>
              <button
                onClick={handleCopy}
                className={`flex items-center px-3 py-1.5 ${
                  copied ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                } rounded hover:bg-gray-200 transition-colors`}
              >
                {copied ? (
                  <>
                    <FiCheck className="mr-1" /> Copied
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-1" /> Copy
                  </>
                )}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                <FiDownload className="mr-1" /> Download
              </button>
            </>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full h-64 p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{wordCount(editedText)} words</span>
            <span>{charCount(editedText)} characters</span>
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {proposal.proposal_text.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4 text-gray-700">
              {paragraph}
            </p>
          ))}
          <div className="mt-6 text-sm text-gray-500">
            <span>{wordCount(proposal.proposal_text)} words</span>
            <span className="mx-2">•</span>
            <span>{charCount(proposal.proposal_text)} characters</span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProposalContent;
