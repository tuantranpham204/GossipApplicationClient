import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
      {/* Dark base */}
      <div className="absolute inset-0 bg-black" />

      {/* Primary Blob */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-[var(--primary-color)] blur-[120px] opacity-20"
        animate={{
          x: ['-20%', '20%', '-20%'],
          y: ['-20%', '20%', '-20%'],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ top: '10%', left: '10%' }}
      />

      {/* Secondary Blob (Blue/Indigo for contrast) */}
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-indigo-600 blur-[100px] opacity-20"
        animate={{
          x: ['20%', '-20%', '20%'],
          y: ['20%', '-20%', '20%'],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ bottom: '10%', right: '10%' }}
      />

      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      ></div>
    </div>
  );
};

export default AnimatedBackground;
