import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiUserPlus } from 'react-icons/fi';

import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import AuthButton from '../../components/auth/AuthButton';

import { register } from '../../redux/slices/AuthSlice';
import { useDispatch } from 'react-redux';

import { toast } from 'react-toastify';
import authAPI from '../../api/AuthAPI';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
    agreeToTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password1) newErrors.password1 = 'Password is required';
    if (formData.password1.length < 8) newErrors.password1 = 'Password must be at least 8 characters';
    if (formData.password1 !== formData.password2) newErrors.password2 = 'Passwords do not match';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    
   
    try {
      const response = await authAPI.register(formData);
      const payload = {
        user: response.user,
        tokens: response.tokens
      }
      dispatch(register(payload));
      console.log('Registration successful', formData);
      toast.success('Registration successful');
      navigate('/verify-email', { state: { email: formData.email } });
      
      setFormData({
        username: '',
        email: '',
        password1: '',
        password2: '',
        agreeToTerms: false
      });
      setErrors({});
    } catch (error) {
      console.error('Registration failed', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <AuthLayout 
      title="Create your account" 
      subtitle="Start generating AI-powered proposals today"
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
            id="username"
            type="text"
            label="Username"
            placeholder="johnedoe"
            icon={FiUser}
            value={formData.username}
            onChange={handleChange}
            required
            error={errors.username}
          />
        </motion.div>
        
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
          <FormInput
            id="password1"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={FiLock}
            value={formData.password1}
            onChange={handleChange}
            required
            error={errors.password1}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FormInput
            id="password2"
            type="password"
            label="Confirm password"
            placeholder="••••••••"
            icon={FiLock}
            value={formData.password2}
            onChange={handleChange}
            required
            error={errors.password2}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center">
          <input
            id="agreeToTerms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
            I agree to the{' '}
            <Link to="/terms" className="font-medium text-emerald-600 hover:text-emerald-500">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="font-medium text-emerald-600 hover:text-emerald-500">
              Privacy Policy
            </Link>
          </label>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms}</p>
          )}
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AuthButton
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            <FiUserPlus className="mr-2 -ml-1 h-4 w-4" />
            Create account
          </AuthButton>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign in
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Signup;
