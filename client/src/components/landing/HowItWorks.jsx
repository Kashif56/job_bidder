import { motion } from 'framer-motion';
import { FiClipboard, FiCpu, FiEdit } from 'react-icons/fi';

const HowItWorks = () => {
  const steps = [
    {
      icon: <FiClipboard className="w-8 h-8" />,
      title: 'Paste',
      description: 'Copy and paste the job description from any freelance platform into Proposly.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: <FiCpu className="w-8 h-8" />,
      title: 'Generate',
      description: 'Our AI analyzes the job and creates a personalized proposal highlighting your skills.',
      color: 'bg-emerald-100 text-emerald-600',
    },
    {
      icon: <FiEdit className="w-8 h-8" />,
      title: 'Customize',
      description: 'Edit the proposal to add your personal touch, then export or copy to clipboard.',
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
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
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Generate winning proposals in three simple steps
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="relative"
              variants={itemVariants}
            >
              <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 h-full">
                <div className={`${step.color} rounded-full p-4 inline-block mb-6`}>
                  {step.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {index + 1}. {step.title}
                </h3>
                
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
              
              {/* Connector line between steps (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-1 bg-gray-200">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-gray-200 rotate-45"></div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-lg text-gray-600 mb-6">
            <span className="font-semibold">The average freelancer</span> spends 5+ hours per week writing proposals.<br />
            With Proposly, you can create winning proposals in <span className="font-semibold text-emerald-600">under 2 minutes</span>.
          </p>
          <a 
            href="#demo" 
            className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700"
          >
            See it in action
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
