import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AuthInput from '../../components/ui/AuthInput';
import AuthButton from '../../components/ui/AuthButton';
import PageTransition from '../../components/ui/PageTransition';
import { authService } from '../../services/auth.service';

const signUpSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  password_confirmation: z.string(),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  gender: z.preprocess((val) => Number(val), z.number().int().min(0).max(2).optional()), // Assuming 0, 1, 2 for gender
  // gender field might be a select in a real app, keeping it simple or maybe assume 1 (male) 0 (female) etc.
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

const SignUpPage = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
     gender: 1
    }
  });

  const onSubmit = async (data) => {
    try {
      await authService.signUp({ user: data });
      toast.success('Registration successful! Please check your email.');
      navigate('/activation-instructions');
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen py-10 px-4">
      <PageTransition className="max-w-lg">
        <div className="glass-panel w-full p-8">
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--primary-color)]">
            Create Account
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
            {/* ... form fields same as before ... */}
             <div className="grid grid-cols-2 gap-4">
                <AuthInput 
                  label="First Name" 
                  placeholder="John" 
                  {...register('first_name')} 
                  error={errors.first_name} 
                />
                <AuthInput 
                  label="Last Name" 
                  placeholder="Doe" 
                  {...register('last_name')} 
                  error={errors.last_name} 
                />
              </div>
              
              <AuthInput 
                label="Username" 
                placeholder="johndoe" 
                {...register('username')} 
                error={errors.username} 
              />
              
              <AuthInput 
                label="Email" 
                type="email" 
                placeholder="john@example.com" 
                {...register('email')} 
                error={errors.email} 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 w-full text-left">
                  <label className="text-sm font-medium text-gray-300 ml-1">Gender</label>
                  <select 
                    {...register('gender')}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-200 text-white"
                  >
                    <option value="1" className="bg-gray-900">Male</option>
                    <option value="0" className="bg-gray-900">Female</option>
                    <option value="2" className="bg-gray-900">Other</option>
                  </select>
                </div>
              </div>

              <AuthInput 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                {...register('password')} 
                error={errors.password} 
              />
              
              <AuthInput 
                label="Confirm Password" 
                type="password" 
                placeholder="••••••••" 
                {...register('password_confirmation')} 
                error={errors.password_confirmation} 
              />
              
              <div className="mt-6">
                <AuthButton type="submit" isLoading={isSubmitting}>
                  Sign Up
                </AuthButton>
              </div>

          </form>
          
          <p className="mt-6 text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/sign-in" className="text-[var(--primary-color)] hover:text-white transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </PageTransition>
    </div>
  );
};

export default SignUpPage;
