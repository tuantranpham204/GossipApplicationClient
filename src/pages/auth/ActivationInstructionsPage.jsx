import React from 'react';
import { Link } from 'react-router-dom';
import AuthButton from '../../components/ui/AuthButton';
import PageTransition from '../../components/ui/PageTransition';

const ActivationInstructionsPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <PageTransition className="max-w-md">
        <div className="glass-panel w-full p-8 flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-[var(--primary-color)]/20 flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-[var(--primary-color)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--primary-color)]">
            Check Your Email
          </h2>
          
          <p className="text-gray-300 text-center text-sm leading-relaxed">
            We've sent an activation link to your email address.<br/>
            User must activate via email before signing in.
          </p>
          
          <div className="w-full mt-4">
            <Link to="/sign-in" className="w-full block">
              <AuthButton>
                Go to Login
              </AuthButton>
            </Link>
          </div>
        </div>
      </PageTransition>
    </div>
  );
};

export default ActivationInstructionsPage;
