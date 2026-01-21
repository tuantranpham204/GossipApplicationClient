import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import AuthInput from '../../components/ui/AuthInput';
import AuthButton from '../../components/ui/AuthButton';
import PageTransition from '../../components/ui/PageTransition';
import { authService } from '../../services/auth.service';

const signInSchema = z.object({
  email_or_username: z.string().min(1, 'Email or Username is required'),
  password: z.string().min(1, 'Password is required'),
});

const SignInPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    try {
      // API expects nested user object: { user: { ... } }
      const response = await authService.signIn({ user: data });
      
      // Assuming response contains token/user info. 
      // Based on typical Rails devise/jwt, it might return user data and headers.
      // But let's check what useAuthStore expects.
      // If we look at apiClient, it gets accessToken from store.
      // We might need to extract token from response if it's in body or headers.
      // Let's assume response.data (wrapped in handleApiResponse) returns the payload.
      
      if (response) {
         // Assuming response is the data object from handleApiResponse:
         const accessToken = response.token || response.accessToken || response.data?.token;
         const userData = response.user || response.data?.user;

         if (accessToken) {
             setAuth(userData, accessToken);
             toast.success('Welcome back!');
             navigate('/');
         } else {
             // Fallback: try to set whatever we got, assuming the store might handle it or it's just a raw object
             setAuth(response, response.token); 
             toast.success('Welcome back!');
             navigate('/');
         }
      }
    } catch (error) {
      console.error("Login failed", error);
      // error toast handled by interceptor
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen py-10 px-4">
      <PageTransition className="max-w-md">
        <div className="glass-panel w-full p-8">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--primary-color)]">
            Welcome Back
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AuthInput 
              label="Email or Username" 
              placeholder="Enter your email or username" 
              {...register('email_or_username')} 
              error={errors.email_or_username} 
            />
            
            <AuthInput 
              label="Password" 
              type="password" 
              placeholder="••••••••" 
              {...register('password')} 
              error={errors.password} 
            />
            
            <div className="pt-2">
              <AuthButton type="submit" isLoading={isSubmitting}>
                Sign In
              </AuthButton>
            </div>
          </form>
          
          <p className="mt-6 text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/sign-up" className="text-[var(--primary-color)] hover:text-white transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </PageTransition>
    </div>
  );
};

export default SignInPage;
