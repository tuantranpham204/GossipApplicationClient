import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient, { handleApiResponse } from '../api/apiClient';
import { useAuthStore } from '../store/useAuthStore';

// --- API Functions ---

/**
 * Register a new user
 * @param {Object} data - User registration data
 * @param {Object} data.user - User object wrapper
 * @returns {Promise}
 */
const signUp = async (data) => {
  // Expecting data structure: { user: { username, email, password, password_confirmation, ... } }
  return handleApiResponse(apiClient.post('/users/sign_up', data));
};

/**
 * Sign in a user
 * @param {Object} data - Login credentials
 * @param {Object} data.user - User object wrapper
 * @returns {Promise}
 */
const signIn = async (data) => {
  // Expecting data structure: { user: { email_or_username, password } }
  return handleApiResponse(apiClient.post('/users/sign_in', data));
};

// --- React Query Hooks ---

/**
 * Hook for user sign up.
 */
export const useSignUpMutation = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      toast.success(data.message || 'Registration successful! Please check your email for activation instructions.');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
};

/**
 * Hook for user sign in.
 */
export const useSignInMutation = () => {
  const setAuth = useAuthStore.getState().setAuth;

  return useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      // Data from signIn is { accessToken, user } or similar
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.username || "User"}!`);
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
      toast.error(error.message || 'Sign in failed. Please check your credentials.');
    },
  });
};
