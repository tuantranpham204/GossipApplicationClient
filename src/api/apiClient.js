import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';

// Base URL from the API documentation
const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_SERVER_URL}${import.meta.env.VITE_API_V1_SERVER}`,
});

// --- Request Interceptor ---
// This interceptor automatically adds the auth token to every request.
apiClient.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// This interceptor handles 401/403 errors by logging the user out
// and redirecting them to the login page.
apiClient.interceptors.response.use(
  (response) => {
    // All successful 2xx responses will just pass through.
    // We will unwrap the `data` field in the specific API functions.
    return response;
  },
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/sign_in') || error.config?.url?.includes('/sign_up');
    
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Don't logout if it's a login/signup endpoint - those are expected to fail with 401
      if (!isAuthEndpoint) {
        console.error("Authentication Error: Logging out user.");
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

/**
 * A helper function to handle API responses.
 * All backend responses are wrapped in { code, message, data }.
 * This function unwraps the `data` field for successful requests.
 * @param {Promise} request - The Axios request promise.
 * @returns {Promise<any>} - The `data` field from the API response.
 */
export const handleApiResponse = async (request) => {
  try {
    const response =  await request;
    let apiResponse = response.data;

    // Handle stringified JSON (often happens with circular refs or wrong Content-Type)
    if (typeof apiResponse === 'string') {
      try {
        apiResponse = JSON.parse(apiResponse);
      } catch (e) {
        console.error("Failed to parse API response string: ", apiResponse);
        toast.error(`Failed to parse API response string: ${e.message}`);
      }
    }

    // Successful code 200: Return data if present, otherwise true
    if (apiResponse && apiResponse.code == 200) {
      return apiResponse.data !== undefined ? apiResponse.data : true;
    } else {
      const msg = apiResponse?.message || 'An API error occurred.';
      console.error(`[API ERROR ${apiResponse?.code}]`, apiResponse);
      toast.error(msg);
      throw new Error(msg);
    }
  } catch (error) {
    console.error('[NETWORK/GATEWAY ERROR]', error.response?.data || error.message);
    throw error;
  }
};

export default apiClient;
