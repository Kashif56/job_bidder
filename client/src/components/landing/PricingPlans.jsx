import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const PricingPlans = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out Proposly',
      monthlyPrice: 0,
      annualPrice: 0,
      features: [
        { text: '5 AI-generated proposals per month', included: true },
        { text: 'Basic customization options', included: true },
        { text: 'Copy to clipboard export', included: true },
        { text: 'Email support', included: true },
        { text: 'Proposal history', included: false },
        { text: 'Advanced customization', included: false },
        { text: 'PDF export', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started',
      ctaLink: '/signup',
      highlight: false,
    },
    {
      name: 'Pro',
      description: 'For serious freelancers',
      monthlyPrice: 19,
      annualPrice: 15,
      features: [
        { text: 'Unlimited AI-generated proposals', included: true },
        { text: 'Advanced customization options', included: true },
        { text: 'All export options (PDF, Word, Email)', included: true },
        { text: 'Proposal history & analytics', included: true },
        { text: 'Custom templates', included: true },
        { text: 'Client matching insights', included: true },
        { text: 'Priority support', included: true },
        { text: 'Team collaboration', included: false },
      ],
      cta: 'Start Free Trial',
      ctaLink: '/signup?plan=pro',
      highlight: true,
    },
    {
      name: 'Team',
      description: 'For agencies and teams',
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        { text: 'Everything in Pro plan', included: true },
        { text: 'Team collaboration (up to 5 users)', included: true },
        { text: 'Team analytics dashboard', included: true },
        { text: 'Shared proposal templates', included: true },
        { text: 'Brand customization', included: true },
        { text: 'API access', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'Custom onboarding', included: true },
      ],
      cta: 'Contact Sales',
      ctaLink: '/contact',
      highlight: false,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Choose the plan that's right for your freelance business
          </p>
          
          {/* Billing toggle */}
          <div className="flex items-center justify-center">
            <span className={`mr-3 ${isAnnual ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-12 items-center rounded-full bg-emerald-600"
            >
              <span className="sr-only">Toggle billing frequency</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  isAnnual ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`ml-3 ${isAnnual ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              Annual <span className="text-emerald-600 font-medium">(Save 20%)</span>
            </span>
          </div>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {plans.map((plan, index) => (
            <motion.div 
              key={index} 
              className={`relative rounded-2xl overflow-hidden ${
                plan.highlight 
                  ? 'border-2 border-emerald-500 shadow-xl' 
                  : 'border border-gray-200 shadow-lg'
              }`}
              variants={itemVariants}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-0 right-0 bg-emerald-500 text-white text-center py-1 text-sm font-medium">
                  Most Popular
                </div>
              )}
              
              <div className={`bg-white p-8 ${plan.highlight ? 'pt-8' : 'pt-6'}`}>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600 ml-2">
                    /month
                  </span>
                  
                  {isAnnual && plan.annualPrice > 0 && (
                    <div className="text-sm text-emerald-600 mt-1">
                      Billed annually (${plan.annualPrice * 12}/year)
                    </div>
                  )}
                </div>
                
                <Link
                  to={plan.ctaLink}
                  className={`block w-full py-3 px-4 rounded-lg text-center font-medium ${
                    plan.highlight
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } transition-colors mb-8`}
                >
                  {plan.cta}
                </Link>
                
                <div className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      {feature.included ? (
                        <FiCheck className="w-5 h-5 text-emerald-500 mt-0.5 mr-3 flex-shrink-0" />
                      ) : (
                        <FiX className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Enterprise callout */}
        <motion.div 
          className="mt-16 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 shadow-xl text-white"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Need a custom solution?
              </h3>
              <p className="text-gray-300 max-w-2xl">
                Contact our sales team for enterprise pricing, custom integrations, or specific requirements for your agency or large team.
              </p>
            </div>
            <Link
              to="/contact"
              className="px-8 py-4 bg-white text-gray-900 hover:bg-gray-100 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 whitespace-nowrap"
            >
              Contact Sales
            </Link>
          </div>
        </motion.div>
        
        {/* Money-back guarantee */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-600">
            <span className="font-medium">14-day money-back guarantee.</span> Try Proposly risk-free.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingPlans;
