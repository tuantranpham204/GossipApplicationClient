import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient, { handleApiResponse } from '../api/apiClient';
import { useAuthStore } from '../store/useAuthStore';
import { ROLES } from '../utils/enum' 
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

/**
 * Sign out the current user
 * @returns {Promise}
 */
const signOut = async () => {
  return handleApiResponse(apiClient.delete('/users/sign_out'));
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
    onSuccess: (response) => {
      // Structure: { code, status, message, data: { token, user_id, username, roles } };
      const user = {
        id: response.user_id,
        username: response.username,
        role: response.roles?.[0] || ROLES.USER, 
        firstName: response.firstName,
        lastName: response.lastName,
        avatar_url: response.avatar_url,
  
      };
      const accessToken = response.token;
      
      setAuth(user, accessToken);
      toast.success(`Welcome back, ${response.username || "User"}!`);
    },
    onError: (error) => {
      console.error('Sign in failed:', error);
    },
  });
};

/**
 * Hook for user sign out.
 */
export const useSignOutMutation = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: signOut,
    onSuccess: (data) => {
      logout();
      toast.success(data.message || 'Signed out successfully.');
    },
    onError: (error) => {
      console.error('Sign out failed:', error);
      // Force logout on client side even if API fails (optional, but good UX)
      logout();
    },
  });
};
