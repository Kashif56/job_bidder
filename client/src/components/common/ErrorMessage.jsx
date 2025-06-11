import { motion } from 'framer-motion';
import { FiAlertCircle, FiArrowLeft } from 'react-icons/fi';

const ErrorMessage = ({ message, onBack }) => {
  return (
    <motion.div 
      className="bg-white rounded-lg p-8 border border-gray-200 text-center max-w-2xl mx-auto my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="rounded-full bg-red-100 p-3">
          <FiAlertCircle className="h-8 w-8 text-red-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Error</h2>
        <p className="text-gray-600">{message || 'An error occurred. Please try again.'}</p>
        
        {onBack && (
          <button
            onClick={onBack}
            className="mt-4 flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Go Back
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ErrorMessage;
