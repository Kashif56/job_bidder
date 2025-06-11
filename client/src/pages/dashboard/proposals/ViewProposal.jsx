import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProposalAPI from '../../../api/ProposalAPI';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

// Components
import ProposalHeader from '../../../components/proposals/ProposalHeader';
import ProposalContent from '../../../components/proposals/ProposalContent';
import ProposalMetadata from '../../../components/proposals/ProposalMetadata';
import ProposalActions from '../../../components/proposals/ProposalActions';
import ProposalFeedback from '../../../components/proposals/ProposalFeedback';
import LoadingSkeleton from '../../../components/common/LoadingSkeleton';
import ErrorMessage from '../../../components/common/ErrorMessage';

const ViewProposal = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proposal, setProposal] = useState(null);
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, y: -20 }
  };
  
  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  // Get proposal data from Redux or API
  useEffect(() => {
    const fetchProposal = async () => {
      setLoading(true);
      setError(null);
      
      try {
        
        const response = await ProposalAPI.get_proposal(proposalId);
        
        if (response.status === 'success' && response.proposal) {
          setProposal(response.proposal);
        } else {
          setError('Failed to load proposal data');
        }
        setLoading(false);
    
      } catch (err) {
        console.error('Error fetching proposal:', err);
        setError(err.message || 'Failed to load proposal');
        setLoading(false);
        toast.error('Error loading proposal data');
      }
    };
    
    fetchProposal();
  }, [proposalId]);
  
  // Handle back navigation
  const handleBack = () => {
    navigate('/dashboard/proposals/all');
  };

  if (loading) {
    return <LoadingSkeleton type="proposal" />;
  }

  if (error) {
    return <ErrorMessage message={error} onBack={handleBack} />;
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Proposal Header */}
      <ProposalHeader 
        proposal={proposal} 
        onBack={handleBack}
        variants={itemVariants}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div 
          className="lg:col-span-2 space-y-6"
          variants={itemVariants}
        >
          {/* Proposal Content */}
          <ProposalContent proposal={proposal} />
          
          {/* Feedback Section */}
          <ProposalFeedback proposal={proposal} />
        </motion.div>
        
        {/* Sidebar */}
        <motion.div 
          className="space-y-6"
          variants={itemVariants}
        >
          {/* Proposal Metadata */}
          <ProposalMetadata proposal={proposal} />
          
          {/* Proposal Actions */}
          <ProposalActions proposal={proposal} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ViewProposal;
