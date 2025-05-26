import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Logo = ({ size = 'medium', linkTo = '/' }) => {
  // Size variants
  const sizes = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl',
    xlarge: 'text-4xl'
  };

  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, y: -5 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        ease: "easeOut" 
      }
    },
    hover: { 
      scale: 1.05,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  const content = (
    <motion.div 
      className={`font-extrabold ${sizes[size]} tracking-tight`}
      variants={logoVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <span className="text-emerald-600">Prop</span>
      <span className="text-gray-900">osly</span>
    </motion.div>
  );

  // If linkTo is provided, wrap in Link component
  return linkTo ? (
    <Link to={linkTo} className="inline-block">
      {content}
    </Link>
  ) : (
    content
  );
};

export default Logo;
