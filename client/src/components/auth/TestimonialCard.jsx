import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

const TestimonialCard = ({ quote, author, role, rating = 5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-white p-5 rounded-lg border border-emerald-100"
    >
      {/* Stars */}
      <div className="flex mb-3">
        {[...Array(rating)].map((_, i) => (
          <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
      
      {/* Quote */}
      <p className="text-gray-700 italic mb-4">"{quote}"</p>
      
      {/* Author */}
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold text-sm">
          {author.charAt(0)}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">{author}</p>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
