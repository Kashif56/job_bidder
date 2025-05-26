import { motion } from 'framer-motion';
import { FiFileText, FiClock, FiTrendingUp, FiUsers } from 'react-icons/fi';
import Logo from '../common/Logo';
import AuthBackground from './AuthBackground';
import TestimonialCard from './TestimonialCard';
import FeatureHighlight from './FeatureHighlight';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
      {/* Decorative background */}
      <AuthBackground />
      
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Logo size="large" linkTo="/" />
          </div>
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-center text-3xl font-extrabold text-gray-900"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-2 text-center text-sm text-gray-600"
          >
            {subtitle}
          </motion.p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 rounded-xl border border-gray-200">
            {children}
          </div>
          
          {/* Mobile testimonial - only visible on small screens */}
          <div className="mt-8 lg:hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100">
              <TestimonialCard 
                quote="Proposly helped me land 3 new clients in my first week!"
                author="Sarah Johnson"
                role="UX Designer"
                rating={5}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Features and testimonials (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-50 to-teal-50 p-12 flex-col justify-center relative z-10 border-l border-emerald-100">
        <div className="max-w-md mx-auto">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 mb-6"
          >
            Why freelancers love Proposly
          </motion.h3>
          
          {/* Features */}
          <div className="mb-8">
            <FeatureHighlight 
              icon={FiFileText}
              title="AI-Powered Proposals"
              description="Generate high-quality, personalized proposals in seconds, not hours."
            />
            <FeatureHighlight 
              icon={FiClock}
              title="Save 5+ Hours Per Week"
              description="Focus on client work instead of writing proposals from scratch."
            />
            <FeatureHighlight 
              icon={FiTrendingUp}
              title="Win More Clients"
              description="Our users report a 40% higher success rate with AI-optimized proposals."
            />
            <FeatureHighlight 
              icon={FiUsers}
              title="Join 10,000+ Freelancers"
              description="Join our growing community of successful freelancers worldwide."
            />
          </div>
          
          {/* Testimonials */}
          <div className="space-y-4">
            <TestimonialCard 
              quote="Proposly helped me land 3 new clients in my first week. The proposals are so well-written!"
              author="Sarah Johnson"
              role="UX Designer"
              rating={5}
            />
            <TestimonialCard 
              quote="I used to spend hours writing proposals. Now it takes me 5 minutes and they're even better."
              author="Michael Chen"
              role="Web Developer"
              rating={5}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
