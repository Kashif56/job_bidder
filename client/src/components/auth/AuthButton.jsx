import { motion } from 'framer-motion';

const AuthButton = ({ 
  type = 'button', 
  onClick, 
  isLoading = false, 
  fullWidth = true,
  variant = 'primary',
  children 
}) => {
  const baseClasses = "flex justify-center items-center py-3 px-4 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200";
  
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-700 border-transparent text-white focus:ring-emerald-500",
    secondary: "bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 focus:ring-emerald-500",
    danger: "bg-red-600 hover:bg-red-700 border-transparent text-white focus:ring-red-500",
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''}`}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </motion.button>
  );
};

export default AuthButton;
