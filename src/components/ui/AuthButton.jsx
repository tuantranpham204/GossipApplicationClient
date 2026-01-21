import React from 'react';
import { motion } from 'framer-motion';

const AuthButton = ({ children, isLoading, className = '', ...props }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(217,70,239,0.5)" }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative w-full py-3 px-6 rounded-lg font-semibold text-white overflow-hidden
        bg-[var(--primary-color)] 
        disabled:opacity-70 disabled:cursor-not-allowed
        ${className}
      `}
      disabled={isLoading}
      {...props}
    >
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <motion.svg 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="h-5 w-5 text-white" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </motion.svg>
            Processing...
          </span>
        ) : (
          children
        )}
      </div>
      {/* Glossy overlay effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
    </motion.button>
  );
};

export default AuthButton;
