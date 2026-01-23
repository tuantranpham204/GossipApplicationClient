import React, { forwardRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageTransition from '../../components/ui/PageTransition';
import HeroSidebar from '../../components/ui/HeroSidebar';
import LanguageSwitcher from '../../components/ui/LanguageSwitcher';
import { useSignUpMutation } from '../../services/auth.service';
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

const signUpSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password_confirmation: z.string(),
  gender: z.preprocess((val) => Number(val), z.number().int().min(0).max(2).optional()),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      gender: 1
    }
  });

  const signUpMutation = useSignUpMutation();

  const onSubmit = async (data) => {
    try {
      await signUpMutation.mutateAsync({ user: data });
      navigate('/activation-instructions');
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white text-slate-800 antialiased overflow-hidden">
      {/* Hero Sidebar */}
      <HeroSidebar />

      {/* Main Sign Up Section */}
      <div className="w-full md:w-1/2 lg:w-7/12 relative h-full flex flex-col justify-center items-center overflow-y-auto">
        
        {/* Header with Logo and Language Selector */}
        <div className="absolute top-0 left-0 w-full flex justify-between items-center p-8 z-30">
          <a href="/" className="group flex items-center gap-2">
            <img src={logo} alt="Gossip Logo" className="h-12 w-auto drop-shadow-md group-hover:scale-105 transition-transform" />
          </a>
          
          <LanguageSwitcher />
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl px-12 relative z-10 py-16">
          
          <PageTransition>
            {/* Title Section */}
            <div className="mb-6 text-center md:text-left">
              <h1 className="font-serif text-4xl font-bold text-slate-900 mb-1 tracking-tight">{t('join_circle')}</h1>
              <p className="text-slate-600 text-sm font-medium">{t('create_account_desc')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label={t('first_name')} 
                  placeholder={t('first_name_placeholder')} 
                  {...register('first_name')} 
                  error={errors.first_name} 
                />
                <Input 
                  label={t('last_name')} 
                  placeholder={t('last_name_placeholder')} 
                  {...register('last_name')} 
                  error={errors.last_name} 
                />
              </div>

              {/* Username & Email */}
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label={t('username')} 
                  placeholder={t('username_placeholder')} 
                  {...register('username')} 
                  error={errors.username} 
                />
                <Input 
                  label={t('email_address')} 
                  type="email" 
                  placeholder={t('email_placeholder')} 
                  {...register('email')} 
                  error={errors.email} 
                />
              </div>

              {/* Password & Confirm Password */}
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label={t('password')} 
                  type="password" 
                  placeholder={t('password_placeholder')} 
                  {...register('password')} 
                  error={errors.password} 
                />
                <Input 
                  label={t('confirm')} 
                  type="password" 
                  placeholder={t('confirm_password_placeholder')} 
                  {...register('password_confirmation')} 
                  error={errors.password_confirmation} 
                />
              </div>

              {/* Gender Select */}
              <div className="flex flex-col gap-2 w-full text-left">
                <label className="text-xs font-bold text-slate-700 ml-1">{t('gender')}</label>
                <div className="relative">
                  <select 
                    {...register('gender')}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:border-purple-600 focus:ring-4 focus:ring-purple-500/10 outline-none transition-all text-slate-600 bg-slate-50 hover:bg-white appearance-none cursor-pointer text-sm"
                  >
                    <option value="" disabled>{t('gender_select')}</option>
                    <option value="1">{t('female')}</option>
                    <option value="0">{t('male')}</option>
                    <option value="2">{t('other')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button type="submit" isLoading={signUpMutation.isPending}>
                  {t('create_account')}
                </Button>
              </div>

              {/* Sign In Link */}
              <div className="text-center mt-2">
                <p className="text-xs text-slate-600">
                  {t('already_account')}
                  <Link to="/sign-in" className="ml-1 font-bold text-purple-600 hover:text-pink-600 transition-colors">
                    {t('sign_in_link')}
                  </Link>
                </p>
              </div>

            </form>
          </PageTransition>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
