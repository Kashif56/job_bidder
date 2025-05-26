import { useState } from 'react';
import { motion } from 'framer-motion';

const FormInput = ({
  id,
  type = 'text',
  label,
  placeholder,
  icon: Icon,
  value,
  onChange,
  required = false,
  error = '',
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="mb-4">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`relative rounded-md ${error ? 'border-red-500' : 'border border-gray-200'}`}>
        {Icon && (
          <div className={`absolute inset-y-0 ${isFocused ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none transition-all duration-300`}>
            <Icon className={`h-5 w-5 ${isFocused ? 'text-emerald-500' : 'text-gray-500'}`} />
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          id={id}
          name={id}
          type={type}
          className={`block w-full rounded-md border-0 py-3 ${
            Icon ? (isFocused ? 'pl-3 pr-10' : 'pl-10 pr-3') : 'px-3'
          } bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
          }`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </div>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default FormInput;
