import { motion } from 'framer-motion';

const LoadingSkeleton = ({ type = 'proposal' }) => {
  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="ml-4 flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
          </div>
        </div>
        <div className="mt-4">
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="mt-2 h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
        <div className="mt-4 flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded-full w-24 animate-pulse"></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content Skeleton */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/4 animate-pulse"></div>
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
            </div>
          </div>
          
          {/* Feedback Skeleton */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
            <div className="h-24 bg-gray-200 rounded w-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          {/* Metadata Skeleton */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mb-4"></div>
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-start">
                  <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                  <div className="ml-3 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions Skeleton */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoadingSkeleton;
