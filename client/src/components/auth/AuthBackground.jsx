import { motion } from 'framer-motion';

const AuthBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Top-right decorative circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-emerald-600"
      />
      
      {/* Bottom-left decorative circle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute -bottom-32 -left-20 w-96 h-96 rounded-full bg-teal-500"
      />
      
      {/* Middle decorative pattern */}
      <svg 
        className="absolute opacity-5 text-emerald-800 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern 
            id="diagonalHatch" 
            patternUnits="userSpaceOnUse" 
            width="10" 
            height="10"
          >
            <path 
              d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" 
              stroke="currentColor" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diagonalHatch)" />
      </svg>
    </div>
  );
};

export default AuthBackground;
