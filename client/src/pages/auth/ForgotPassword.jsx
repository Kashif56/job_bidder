import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft } from 'react-icons/fi';

import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import AuthButton from '../../components/auth/AuthButton';

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    // Here you would typically make an API call to send a password reset email
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful submission
      console.log('Password reset email sent', formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send reset email', error);
      setErrors({ form: 'Failed to send reset email. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  // If the form has been submitted, show a success message
  if (isSubmitted) {
    return (
      <AuthLayout 
        title="Check your email" 
        subtitle="We've sent you instructions to reset your password"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FiMail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Check your inbox</h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a password reset link to <span className="font-medium">{formData.email}</span>.
            <br />Please check your email and follow the instructions.
          </p>
          <div className="mt-6">
            <Link 
              to="/login" 
              className="text-sm font-medium text-emerald-600 hover:text-emerald-500 flex items-center justify-center"
            >
              <FiArrowLeft className="mr-2" /> Back to login
            </Link>
          </div>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Reset your password" 
      subtitle="Enter your email and we'll send you a reset link"
    >
      <motion.form 
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {errors.form && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
          >
            {errors.form}
          </motion.div>
        )}
        
        <motion.div variants={itemVariants}>
          <FormInput
            id="email"
            type="email"
            label="Email address"
            placeholder="you@example.com"
            icon={FiMail}
            value={formData.email}
            onChange={handleChange}
            required
            error={errors.email}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AuthButton
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            Send reset link
          </AuthButton>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default ForgotPassword;
