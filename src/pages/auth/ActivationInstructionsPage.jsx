import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../../components/ui/PageTransition';
import HeroSidebar from '../../components/ui/HeroSidebar';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import logo from '../../assets/logo.png';

const ActivationInstructionsPage = () => {
  return (
    <div className="h-screen w-full flex bg-white text-slate-800 antialiased overflow-hidden">
      {/* Hero Sidebar */}
      <HeroSidebar />

      {/* Main Section */}
      <div className="w-full md:w-1/2 lg:w-7/12 relative flex flex-col h-full">
        
        {/* Header with Logo and Language Selector */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-12 z-20">
          <a href="#" className="group flex items-center gap-2">
            <img src={logo} alt="Gossip Logo" className="h-16 w-auto drop-shadow-md group-hover:scale-105 transition-transform" />
          </a>
          <LanguageSwitcher />
        </div>

        {/* Content Section */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          <PageTransition className="max-w-md w-full text-center">
            {/* Email Icon */}
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-6"
            >
              <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </motion.div>
            
            {/* Title */}
            <h2 className="font-serif text-4xl font-bold text-slate-900 mb-4">
              Check Your Email
            </h2>
            
            {/* Description */}
            <p className="text-slate-600 text-base leading-relaxed mb-8">
              We've sent an activation link to your email address.
              <br />
              <span className="font-semibold">Please activate your account via email before signing in.</span>
            </p>
            
            {/* Button */}
            <Link to="/sign-in" className="w-full block">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white 
                  bg-gradient-to-r from-purple-600 to-pink-600
                  hover:from-purple-700 hover:to-pink-700
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  shadow-lg shadow-purple-600/30
                  transition-all duration-200"
              >
                Go to Sign In
              </motion.button>
            </Link>
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default ActivationInstructionsPage;
