import React, { useEffect, forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import PageTransition from '../../components/ui/PageTransition';
import HeroSidebar from '../../components/ui/HeroSidebar';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import { useSignInMutation } from '../../services/auth.service';
import logo from '../../assets/logo.png';

// Input Component
const Input = forwardRef(({ label, error, type = 'text', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  return (
    <div className="flex flex-col gap-2 w-full text-left">
      {label && (
        <label className="text-xs font-bold text-slate-700 ml-1">
          {label}
        </label>
      )}
      <motion.div
        initial={false}
        animate={error ? { x: [0, -5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="relative"
      >
        <input
          ref={ref}
          type={isPasswordField && showPassword ? 'text' : type}
          className={`
            w-full px-4 py-3.5 rounded-xl border 
            focus:outline-none focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-slate-400 bg-slate-50 hover:bg-white text-slate-900
            ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
                : 'border-slate-200 focus:border-purple-600 hover:border-slate-300'
            }
          `}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-purple-600 transition-colors p-1"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L9.871 9.871" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
      </motion.div>
      {error && (
        <motion.span 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs ml-1"
        >
          {error.message}
        </motion.span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Button Component
const Button = ({ children, isLoading, ...props }) => {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="
        w-full py-3.5 px-4 rounded-xl text-sm font-bold text-white 
        bg-gradient-to-r from-purple-600 to-pink-600
        hover:from-purple-700 hover:to-pink-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
        shadow-lg shadow-purple-600/30
        transition-all duration-200
        disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none
      "
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3">
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
          <span>Processing...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

const signInSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { t } = useTranslation();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const signInMutation = useSignInMutation();

  // Handle activation parameter redirect
  useEffect(() => {
    const confirmed = searchParams.get('confirmed');
    if (confirmed && ['true', 'invalid', 'already'].includes(confirmed)) {
      navigate(`/activation-status?confirmed=${confirmed}`, { replace: true });
    }
  }, [searchParams, navigate]);

  const onSubmit = async (data) => {
    try {
      await signInMutation.mutateAsync({ user: data });
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white text-slate-800 antialiased overflow-hidden">
      {/* Hero Sidebar */}
      <HeroSidebar />

      {/* Main Sign In Section */}
      <div className="w-full md:w-1/2 lg:w-7/12 relative flex flex-col h-full">
        
        {/* Header with Logo and Language Selector */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-12 z-20">
          
          <a href="#" className="group flex items-center gap-2">
            <img src={logo} alt="Gossip Logo" className="h-16 w-auto drop-shadow-md group-hover:scale-105 transition-transform" />
          </a>

          <LanguageSwitcher />
        </div>

        {/* Form Section */}
        <div className="flex-1 flex items-center justify-center p-8 relative">
          
          {/* Watermark */}
          <div className="absolute -bottom-20 -right-20 text-purple-600 opacity-[0.03] font-serif text-[400px] pointer-events-none select-none z-0 font-bold">
            G
          </div>

          <PageTransition className="max-w-md w-full relative z-10">
            
            {/* Title Section */}
            <div className="mb-10 text-center md:text-left">
              <h1 className="font-serif text-5xl font-bold text-slate-900 mb-2 tracking-tight">{t('hello_insider')}</h1>
              <p className="text-slate-600 text-lg font-medium">{t('spill_tea')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              <div className="space-y-2">
                <Input 
                  label={t('email_address')} 
                  placeholder={t('email_placeholder')} 
                  {...register('email')} 
                  error={errors.email} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-sm font-semibold text-slate-700">{t('password')}</label>
                  <a href="#" className="text-xs font-bold text-pink-600 hover:underline">{t('forgot_password')}</a>
                </div>
                <Input 
                  label="" 
                  type="password" 
                  placeholder={t('password_placeholder')} 
                  {...register('password')} 
                  error={errors.password} 
                />
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={signInMutation.isPending} onClick={handleSubmit(onSubmit)}>
                  {t('sign_in')}
                </Button>
              </div>

              {/* Divider */}
              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">{t('or_continue_with')}</span>
                </div>
              </div>

              {/* Google Login Button */}
              <button 
                type="button" 
                className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="h-5 w-5" alt="Google Logo" />
                {t('login_google')}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-slate-600 pt-2">
                {t('no_account')}
                <Link to="/sign-up" className="ml-1 font-bold text-purple-600 hover:text-pink-600 transition-colors">
                  {t('apply_access')}
                </Link>
              </p>

            </form>
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
