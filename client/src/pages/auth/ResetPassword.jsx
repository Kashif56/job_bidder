import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiCheck } from 'react-icons/fi';

import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import AuthButton from '../../components/auth/AuthButton';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get token from URL query params (in a real app, you'd validate this token)
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

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
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
    // Here you would typically make an API call to reset the password
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful password reset
      console.log('Password reset successful', { ...formData, token });
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      console.error('Password reset failed', error);
      setErrors({ form: 'Password reset failed. Please try again.' });
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

  // If no token is provided, show an error
  if (!token) {
    return (
      <AuthLayout 
        title="Invalid reset link" 
        subtitle="Please request a new password reset link"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <FiLock className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Invalid or expired link</h3>
          <p className="text-sm text-gray-600 mb-6">
            The password reset link is invalid or has expired.
            <br />Please request a new password reset link.
          </p>
          <Link to="/forgot-password">
            <AuthButton variant="primary">
              Request new link
            </AuthButton>
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  // If password reset is successful, show success message
  if (isSuccess) {
    return (
      <AuthLayout 
        title="Password reset successful" 
        subtitle="You can now log in with your new password"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FiCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Password updated</h3>
          <p className="text-sm text-gray-600 mb-6">
            Your password has been successfully reset.
            <br />Redirecting you to login...
          </p>
          <Link to="/login">
            <AuthButton variant="primary">
              Go to login
            </AuthButton>
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Create new password" 
      subtitle="Enter your new password below"
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
            id="password"
            type="password"
            label="New password"
            placeholder="••••••••"
            icon={FiLock}
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FormInput
            id="confirmPassword"
            type="password"
            label="Confirm new password"
            placeholder="••••••••"
            icon={FiLock}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={errors.confirmPassword}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AuthButton
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            Reset password
          </AuthButton>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default ResetPassword;
