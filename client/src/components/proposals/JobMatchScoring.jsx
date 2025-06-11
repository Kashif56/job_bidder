import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiTrendingUp, FiTarget } from 'react-icons/fi';
import ProposalAPI from '../../api/ProposalAPI';
import { toast } from 'react-toastify';

const JobMatchScoring = ({ jobDescription }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');

  // Get recommendation color based on value
  const getRecommendationColor = (recommendation) => {
    const recommendationMap = {
      'Highly Recommended': 'text-emerald-600',
      'Recommended': 'text-blue-600',
      'Consider with Caution': 'text-amber-600',
      'Not Recommended': 'text-red-600'
    };
    
    return recommendationMap[recommendation] || 'text-gray-600';
  };

  // Get score color based on value
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  // Analyze job match
  const analyzeJobMatch = async () => {
    if (!jobDescription || jobDescription.trim().length < 50) {
      toast.warning('Please enter a detailed job description first');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await ProposalAPI.analyze_job_match(jobDescription);
      
      if (response.status === 'success') {
        setAnalysis(response.analysis);
      } else {
        setError(response.message || 'Failed to analyze job match');
        toast.error('Failed to analyze job match');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the job match');
      toast.error(err.message || 'Failed to analyze job match');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Job Match Analysis</h2>
      </div>
      
      {!analysis ? (
        <div className="text-center py-6">
          <p className="text-gray-600 mb-4">
            Analyze how well your skills match this job and if it's worth bidding on
          </p>
          <button
            onClick={analyzeJobMatch}
            disabled={isLoading}
            className={`
              inline-flex items-center justify-center px-6 py-3 
              bg-indigo-600 text-white font-medium rounded-lg
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
              transition-colors duration-200 ease-in-out
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>Analyze Job Match</>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Match Score */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTarget className="text-gray-500 mr-2" size={20} />
              <span className="text-gray-700 font-medium">Match Score:</span>
            </div>
            <div className={`text-xl font-bold ${getScoreColor(analysis.match_score)}`}>
              {analysis.match_score}/100
            </div>
          </div>
          
          {/* Recommendation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiTrendingUp className="text-gray-500 mr-2" size={20} />
              <span className="text-gray-700 font-medium">Recommendation:</span>
            </div>
            <div className={`font-semibold ${getRecommendationColor(analysis.recommendation)}`}>
              {analysis.recommendation}
            </div>
          </div>
          
          {/* Strengths */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
              <FiCheckCircle className="text-emerald-500 mr-2" size={18} />
              Key Strengths
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="text-gray-600">{strength}</li>
              ))}
            </ul>
          </div>
          
          {/* Gaps */}
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2 flex items-center">
              <FiAlertCircle className="text-amber-500 mr-2" size={18} />
              Potential Gaps
            </h3>
            <ul className="list-disc pl-6 space-y-1">
              {analysis.gaps.map((gap, index) => (
                <li key={index} className="text-gray-600">{gap}</li>
              ))}
            </ul>
          </div>
          
          {/* Strategy */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md font-medium text-blue-700 mb-2">Winning Strategy</h3>
            <p className="text-blue-600">{analysis.strategy}</p>
          </div>
          
          {/* Reset button */}
          <div className="text-center pt-2">
            <button
              onClick={() => setAnalysis(null)}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              Reset Analysis
            </button>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}
    </motion.div>
  );
};

export default JobMatchScoring;
