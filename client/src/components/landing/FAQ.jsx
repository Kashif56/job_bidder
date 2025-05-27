import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'How accurate are the AI-generated proposals?',
      answer: 'Our AI has been trained on thousands of successful freelance proposals and uses advanced natural language processing to create highly relevant, personalized proposals based on the job description. Most users find they only need to make minor adjustments before sending. The more information provided in the job post, the more accurate and tailored the proposal will be.'
    },
    {
      question: 'Can I customize the tone and style of the proposals?',
      answer: 'Absolutely! You can select from different tones (professional, conversational, technical) and adjust the proposal style to match your personal brand. You can also edit any generated proposal directly in our editor before exporting or sending it to clients.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: `Yes, all paid plans come with a 14-day free trial, no credit card required. You can generate up to 5 proposals with the free plan to test our service before upgrading. We also offer a 14-day money-back guarantee if you're not satisfied with your paid plan.`
    },
    {
      question: 'How do you handle my data and privacy?',
      answer: `We take privacy seriously. Your data is encrypted and securely stored. We don't share or sell your information to third parties. The proposals you generate and your client information remain private to you. You can delete your data at any time from your account settings.`
    },
    {
      question: 'Can I use Proposly for any type of freelance work?',
      answer: `Yes! Proposly works for all types of freelance services including writing, design, development, marketing, consulting, and more. Our AI adapts to different industries and project types to create relevant proposals for your specific field.`
    },
    {
      question: 'How does billing work for the subscription plans?',
      answer: `For monthly plans, you'll be billed every month on the date you signed up. For annual plans, you'll be billed once per year with a 20% discount compared to monthly billing. You can upgrade, downgrade, or cancel your subscription at any time from your account settings.`
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Proposly
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`border rounded-lg overflow-hidden ${
                activeIndex === index 
                  ? 'border-emerald-200 bg-emerald-50' 
                  : 'border-gray-200 bg-white'
              }`}
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleAccordion(index)}
              >
                <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                {activeIndex === index ? (
                  <FiChevronUp className="w-5 h-5 text-emerald-600" />
                ) : (
                  <FiChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 text-gray-600">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-gray-600 mb-6">
            Still have questions? We're here to help.
          </p>
          <a 
            href="/contact" 
            className="inline-flex items-center text-emerald-600 font-medium hover:text-emerald-700"
          >
            Contact our support team
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
