import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient, { handleApiResponse } from '../api/apiClient';

// --- API Functions ---

/**
 * Fetch profiles by search query
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} perPage - Records per page
 * @returns {Promise}
 */
const fetchProfilesByQuery = async (query = '', page = 1, perPage = 10) => {
  const params = { q: query, page, per_page: perPage };
  return handleApiResponse(apiClient.get('/profiles/search', { params }))
};

/**
 * Fetch a specific user's profile
 * @param {string|number} userId - The ID of the user
 * @returns {Promise}
 */
const fetchHostProfile = async (userId) => {
  return handleApiResponse(apiClient.get(`/profiles/host/${userId}`));
};



/**
 * Format gender based on the gender value
 * @param {string} gender - The gender value
 * @param {function} t - Translation function
 * @returns {string}
 */
const gender = (gender, t) => {
    if (!gender) return t('gender.unknown');
    return t(`gender.${gender.toLowerCase()}`);
};

/**
 * Format relationship status based on the relationship status value
 * @param {string} relationship_status - The relationship status value
 * @param {function} t - Translation function
 * @returns {string}
 */
const relationship_status = (relationship_status, t) => {
    if (!relationship_status) return t('relationship_status.unknown');
    return t(`relationship_status.${relationship_status.toLowerCase()}`);
};

// --- React Query Hooks ---

/**
 * Hook to fetch profiles by query.
 * @param {string} query - Search query
 */
export const useProfilesByQuery = (query = '') => {
  return useQuery({
    queryKey: ['profiles', query],
    queryFn: () => fetchProfilesByQuery(query),
    keepPreviousData: true,
    retry: 1,
  });
};

/**
 * Hook to fetch a user's profile.
 * @param {string|number} userId - The ID of the user
 */
export const useHostProfileQuery = (userId, options = {}) => {
  return useQuery({
    queryKey: ['hostProfile', userId],
    queryFn: () => fetchHostProfile(userId),
    enabled: !!userId && (options.enabled !== false),
    keepPreviousData: true,
  });
};

/**
 * Fetch a specific user's guest profile
 * @param {string|number} userId - The ID of the user
 * @returns {Promise}
 */
const fetchGuestProfile = async (userId) => {
  return handleApiResponse(apiClient.get(`/profiles/guest/${userId}`));
};

/**
 * Fetch a specific user's avatar
 * @param {string|number} userId - The ID of the user
 * @returns {Promise}
 */
const fetchUserAvatar = async (userId) => {
    return handleApiResponse(apiClient.get(`/profiles/avatar/${userId}`));
};

/**
 * Hook to fetch a guest user's profile.
 * @param {string|number} userId - The ID of the user
 */
export const useGuestProfileQuery = (userId, options = {}) => {
  return useQuery({
    queryKey: ['guestProfile', userId],
    queryFn: () => fetchGuestProfile(userId),
    enabled: !!userId && (options.enabled !== false),
    keepPreviousData: true,
  });
};

/**
 * Hook to fetch user avatar
 * @param {string|number} userId - The ID of the user
 */
export const useUserAvatarQuery = (userId) => {
    return useQuery({
        queryKey: ['userAvatar', userId],
        queryFn: () => fetchUserAvatar(userId),
        enabled: !!userId,
        retry: 1,
        refetchOnMount: true,
        refetchOnWindowFocus: true,
    });
};

/**
 * Update user avatar
 * @param {string|number} userId - ID of the user
 * @param {File} file - The image file
 * @returns {Promise}
 */
const updateUserAvatar = async (userId, file) => {
    console.log("updateUserAvatar called with:", { userId, file }); // Debug log

    const formData = new FormData();
    formData.append('raw_avatar_data', file);
    
    // Debug: Log FormData entries (checking if it's truly empty)
    for (let pair of formData.entries()) {
        console.log("FormData Entry:", pair[0], pair[1]); 
    }

    // Let browser handle boundary
    return handleApiResponse(apiClient.patch(`/profiles/avatar/${userId}`, formData));
};

/**
 * Update user profile
 * @param {string|number} userId - ID of the user
 * @param {Object} data - The profile data to update
 * @returns {Promise}
 */
const updateProfile = async (userId, data) => {
    console.log("updateProfile called with:", { userId, data });
    
    try {
        const response = await apiClient.patch(`/profiles/update/${userId}`, data);
        console.log("updateProfile raw response:", response);
        return response.message;
    } catch (error) {
        throw error;
    }
};

/**
 * Hook to update user avatar
 */
export const useUpdateUserAvatarMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, file }) => updateUserAvatar(userId, file),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries(['userAvatar', variables.userId]);
        },
        onError: (error) => {
            console.error("Avatar upload failed:", error);
        }
    });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, data }) => updateProfile(userId, data),
        onSuccess: (data, variables) => {
            console.log("Profile updated successfully:", data);
            // Invalidate queries to refresh data
            queryClient.invalidateQueries(['hostProfile', variables.userId]);
            queryClient.invalidateQueries(['users']); // If list shows updated info
        },
        onError: (error) => {
            console.error("Profile update failed:", error);
        }
    });
};

// Better yet, let's export the function directly and also a hook if `useMutation` is available.
// I will check imports first in next step or just modify imports now.

