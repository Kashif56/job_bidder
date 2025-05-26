import { motion } from 'framer-motion';

const FeatureHighlight = ({ icon: Icon, title, description }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-start mb-4"
    >
      <div className="flex-shrink-0 mr-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center border border-emerald-200">
          <Icon className="w-5 h-5 text-emerald-600" />
        </div>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureHighlight;
