import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/auth/FormInput';
import AuthButton from '../../components/auth/AuthButton';
import AuthAPI from '../../api/AuthAPI';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/AuthSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { setIsRawSubmitted } from '../../redux/slices/ProfileSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    rememberMe: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    
    // Validate form
    const newErrors = {};
    if (!formData.login) newErrors.login = 'Email or username is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    

    try {
      const response = await AuthAPI.login(formData);
      console.log(response)
      if (response.error) {
        toast.error(response.error);
      } else {
        const payload = {
          user: response.user,
          tokens: response.tokens
        }

        const is_raw_submitted = response.is_raw_submitted
        toast.success('Login successful');
        dispatch(login(payload));
        dispatch(setIsRawSubmitted(is_raw_submitted))

        
        // Reset form
        setFormData({
          login: '',
          password: '',
          rememberMe: true
        });
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error(error.message || 'Invalid login or password');
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

  return (
    <AuthLayout 
      title="Sign in to your account" 
      subtitle="Or start your free trial with Proposly today"
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
            id="login"
            type="text"
            label="Email or Username"
            placeholder="you@example.com"
            icon={FiMail}
            value={formData.login}
            onChange={handleChange}
            required
            error={errors.login}
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <FormInput
            id="password"
            type="password"
            label="Password"
            placeholder="••••••••"
            icon={FiLock}
            value={formData.password}
            onChange={handleChange}
            required
            error={errors.password}
          />
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="rememberMe"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div className="text-sm">
            <Link to="/forgot-password" className="font-medium text-emerald-600 hover:text-emerald-500">
              Forgot your password?
            </Link>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AuthButton
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            <FiLogIn className="mr-2 -ml-1 h-4 w-4" />
            Sign in
          </AuthButton>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-emerald-600 hover:text-emerald-500">
              Sign up
            </Link>
          </p>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default Login;
