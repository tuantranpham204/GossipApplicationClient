import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import apiClient, { handleApiResponse } from '../api/apiClient';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUiStore';

// --- API Functions ---

/**
 * @param {object} credentials - { username, password }
 */
const login = (credentials) => {
  return handleApiResponse(apiClient.post('/users/sign_in', credentials));
};

/**
 * @param {object} userData - { username, fullName, email, password, confirmPassword }
 */
const register = (userData) => {
  return handleApiResponse(apiClient.post('/auth/register', userData));
};

// --- React Query Hooks ---

export const useSignInMutation = () => {
  const { login: setAuthState } = useAuthStore.getState();
  const { closeAuthModal } = useUIStore.getState();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      // Data from login is { accessToken, user }
      setAuthState(data.user, data.accessToken);
      closeAuthModal();
      toast.success(`Welcome back, ${data.user.username}!`);
    },
    onError: (error) => {
      console.error('Login failed:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    },
  });
};

/**
 * Hook for user registration.
 */
export const useSignUpMutation = () => {
  const { openAuthModal } = useUIStore.getState();

  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // data is { message: "User registered successfully!" }
      toast.success(data.message || 'Registration successful! Please log in.');
      // Switch modal to login view
      openAuthModal('login');
    },
    onError: (error) => {
      console.error('Registration failed:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    },
  });
};
