import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const AuthInput = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && <label className="text-sm font-medium text-gray-300 ml-1">{label}</label>}
      <motion.div
        initial={false}
        animate={error ? { x: [0, -5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-lg bg-white/5 border 
            focus:outline-none focus:ring-2 focus:ring-(--primary-color)/50 transition-all duration-300
            placeholder:text-gray-500 text-white backdrop-blur-sm
            ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-white/10 hover:border-white/20 hover:bg-white/10'}
          `}
          {...props}
        />
      </motion.div>
      {error && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xs ml-1"
        >
          {error.message}
        </motion.span>
      )}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;
