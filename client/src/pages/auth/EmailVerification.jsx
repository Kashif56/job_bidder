import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiCheck, FiRefreshCw } from 'react-icons/fi';

import AuthLayout from '../../components/auth/AuthLayout';
import AuthButton from '../../components/auth/AuthButton';

const EmailVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state (passed from signup)
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;
    
    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      inputRefs[3].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Check if OTP is complete
    if (otp.some(digit => !digit)) {
      setError('Please enter the complete verification code');
      setIsLoading(false);
      return;
    }
    
    const otpString = otp.join('');
    
    // Here you would typically make an API call to verify the OTP
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, let's say 1234 is the correct OTP
      if (otpString === '1234') {
        console.log('Email verified successfully');
        setIsVerified(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError('Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Verification failed', error);
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown
    
    // Here you would typically make an API call to resend the OTP
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('OTP resent to', email);
    } catch (error) {
      console.error('Failed to resend OTP', error);
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

  // If no email is provided, redirect to signup
  useEffect(() => {
    if (!email && !isVerified) {
      navigate('/signup');
    }
  }, [email, navigate, isVerified]);

  // If email is verified, show success message
  if (isVerified) {
    return (
      <AuthLayout 
        title="Email verified!" 
        subtitle="Your account is now active"
      >
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8"
        >
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FiCheck className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Verification successful</h3>
          <p className="text-sm text-gray-600 mb-6">
            Your email has been successfully verified.
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
      title="Verify your email" 
      subtitle={`Enter the 4-digit code sent to ${email || 'your email'}`}
    >
      <motion.form 
        onSubmit={handleSubmit}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
          >
            {error}
          </motion.div>
        )}
        
        <motion.div variants={itemVariants} className="mb-6">
          <div className="flex items-center justify-center mb-4">
            <FiMail className="h-12 w-12 text-emerald-500" />
          </div>
          <p className="text-sm text-gray-600 text-center mb-4">
            We've sent a verification code to your email.
            <br />Please check your inbox and enter the code below.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-14 h-14 text-center text-xl font-bold border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50 focus:bg-white transition-all"
              />
            ))}
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AuthButton
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            Verify Email
          </AuthButton>
        </motion.div>
        
        <motion.div variants={itemVariants} className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resendDisabled}
            className={`text-sm font-medium flex items-center justify-center mx-auto ${
              resendDisabled 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-emerald-600 hover:text-emerald-500'
            }`}
          >
            <FiRefreshCw className="mr-1" />
            {resendDisabled 
              ? `Resend code in ${countdown}s` 
              : 'Resend verification code'}
          </button>
        </motion.div>
      </motion.form>
    </AuthLayout>
  );
};

export default EmailVerification;
