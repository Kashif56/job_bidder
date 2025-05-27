import { motion } from 'framer-motion';
import { 
  FiEdit3, 
  FiMessageSquare, 
  FiFileText, 
  FiSave, 
  FiTrendingUp,
  FiZap,
  FiClock
} from 'react-icons/fi';

const Features = () => {
  const mainFeatures = [
    {
      icon: <FiEdit3 className="w-8 h-8" />,
      title: 'AI-Powered Proposal Writing',
      description: 'Our advanced AI analyzes job posts and generates tailored proposals that highlight your relevant skills and experience.',
    },
    {
      icon: <FiMessageSquare className="w-8 h-8" />,
      title: 'Personalized Tone & Style',
      description: 'Customize the writing style to match your voice - professional, conversational, or technical - for authentic proposals.',
    },
    {
      icon: <FiFileText className="w-8 h-8" />,
      title: 'Export to PDF/Email',
      description: 'Easily export your polished proposals to PDF, copy to clipboard, or send directly via email to potential clients.',
    },
  ];
  
  const secondaryFeatures = [
    {
      icon: <FiSave className="w-6 h-6" />,
      title: 'Save Proposal History',
      description: 'Keep track of all your proposals, reuse successful ones, and learn what works best for different types of projects.',
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: 'Client & Job Matching',
      description: 'Get intelligent suggestions on which jobs match your skills and how to position yourself for the highest chance of success.',
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: 'Instant Generation',
      description: 'Generate professional proposals in seconds instead of hours, giving you more time to focus on client work.',
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: 'Time-Saving Templates',
      description: 'Access a library of industry-specific templates that you can customize for different types of freelance projects.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Freelancers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to create winning proposals and land more clients
          </p>
        </motion.div>

        {/* Main Features - Large Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {mainFeatures.map((feature, index) => (
            <motion.div 
              key={index} 
              className={`${index % 2 === 0 ? 'bg-emerald-600' : 'bg-white border-2 border-emerald-200'} rounded-2xl p-8 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300`}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="relative z-10">
                <div className={`${index % 2 === 0 ? 'bg-emerald-500' : 'bg-emerald-100'} rounded-full p-4 inline-flex items-center justify-center mb-6`}>
                  <span className={`${index % 2 === 0 ? 'text-white' : 'text-emerald-600'}`}>
                    {feature.icon}
                  </span>
                </div>
                
                <h3 className={`text-2xl font-bold mb-4 ${index % 2 === 0 ? 'text-white' : 'text-gray-800'}`}>
                  {feature.title}
                </h3>
                
                <p className={`${index % 2 === 0 ? 'text-white text-opacity-90' : 'text-gray-600'} text-lg`}>
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Secondary Features - Smaller Cards in Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {secondaryFeatures.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-md border border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <div className="bg-emerald-50 text-emerald-600 rounded-full p-3 inline-flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Feature highlight - Stats Card */}
        <motion.div 
          className="mt-20 bg-emerald-600 rounded-3xl p-8 md:p-12 shadow-xl text-white overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {/* Clean design with curved shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-emerald-500 -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-emerald-500 -ml-20 -mb-20"></div>
          
          <div className="flex flex-col md:flex-row items-center relative z-10">
            <div className="w-full md:w-2/3 mb-8 md:mb-0 md:pr-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                40% Higher Success Rate
              </h3>
              <p className="text-white text-lg mb-8">
                Freelancers using Proposly report a 40% higher client conversion rate compared to manually written proposals. Our AI-powered system analyzes successful proposals to understand what works.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-emerald-500 rounded-xl px-6 py-4 border border-emerald-400 hover:bg-emerald-500/80 transition-colors duration-300">
                  <div className="text-3xl font-bold text-white">3.5x</div>
                  <div className="text-white text-sm">Faster responses</div>
                </div>
                <div className="bg-emerald-500 rounded-xl px-6 py-4 border border-emerald-400 hover:bg-emerald-500/80 transition-colors duration-300">
                  <div className="text-3xl font-bold text-white">5+ hrs</div>
                  <div className="text-white text-sm">Saved weekly</div>
                </div>
                <div className="bg-emerald-500 rounded-xl px-6 py-4 border border-emerald-400 hover:bg-emerald-500/80 transition-colors duration-300">
                  <div className="text-3xl font-bold text-white">40%</div>
                  <div className="text-white text-sm">Higher win rate</div>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="bg-emerald-500 rounded-full p-8 border border-emerald-400">
                <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
