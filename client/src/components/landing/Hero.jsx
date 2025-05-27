import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <section className="pt-28 pb-16 md:pt-32 md:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left Column - Text Content */}
          <motion.div
            className="w-full lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h1
              className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight"
              variants={itemVariants}
            >
              Write Freelance Proposals in{' '}
              <span className="text-emerald-600">Seconds</span>
            </motion.h1>
            
            <motion.p
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0"
              variants={itemVariants}
            >
              Paste the job post. Get a polished proposal. Win more clients.
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6" variants={itemVariants}>
              <Link
                to="/generate"
                className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center w-full sm:w-auto"
              >
                Generate Proposal for Free
                <FiArrowRight className="ml-2" />
              </Link>
            </motion.div>
            
            <motion.p className="text-gray-500 text-sm" variants={itemVariants}>
              No signup required. No credit card.
            </motion.p>
            
            <motion.div 
              className="mt-12 flex items-center justify-center lg:justify-start space-x-6"
              variants={itemVariants}
            >
              <div className="flex items-center">
                <div className="bg-emerald-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="ml-2 text-gray-600">AI-powered</span>
              </div>
              <div className="flex items-center">
                <div className="bg-emerald-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="ml-2 text-gray-600">Customizable</span>
              </div>
              <div className="flex items-center">
                <div className="bg-emerald-100 rounded-full p-2">
                  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <span className="ml-2 text-gray-600">Time-saving</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Illustration */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="relative">
              {/* Placeholder for illustration/Lottie animation */}
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <div className="bg-gray-100 rounded-xl h-64 md:h-80 flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="text-6xl mb-4">✍️</div>
                    <p className="text-gray-500">Illustration: AI writing a proposal</p>
                  </div>
                </div>
                
                {/* Stats overlay */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 rounded-full p-2 mr-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Average time saved</p>
                      <p className="font-bold text-gray-800">3.5 hours/week</p>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                  <div className="flex items-center">
                    <div className="bg-emerald-100 rounded-full p-2 mr-3">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Freelancers using Proposly</p>
                      <p className="font-bold text-gray-800">10,000+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
