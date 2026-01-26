import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, User, Heart, Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUpdateProfileMutation } from '../../services/user.service';
import { toast } from 'sonner';
import { useAuthStore } from '../../store/useAuthStore';
import { GENDER, RELATIONSHIP_STATUS } from '../../utils/enum';
import { genderToEnum, relationshipStatusToEnum } from '../../utils/utils';

const EditProfileModal = ({ isOpen, onClose, user }) => {
    const { t } = useTranslation();
    const { user: authUser } = useAuthStore();
    
    // Form State
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        bio: '',
        gender: '',
        relationship_status: '',
        allow_direct_follows: false,
        is_gender_public: true,
        is_email_public: true,
        is_rel_status_public: true,
    });

    // Initialize form with user data
    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                bio: user.bio || '',
                gender: user.gender !== null ? user.gender : '', 
                relationship_status: user.relationship_status !== null ? user.relationship_status : '',
                allow_direct_follows: user.allow_direct_follows ?? false,
                is_gender_public: user.is_gender_public ?? true,
                is_email_public: user.is_email_public ?? true,
                is_rel_status_public: user.is_rel_status_public ?? true,
            });
        }
    }, [user, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'radio' ? (value === 'true') : value)
        }));
    };



    const updateProfileMutation = useUpdateProfileMutation();
    const isSaving = updateProfileMutation.isPending;

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const targetUserId = user?.id || authUser?.id;

        if (!targetUserId) {
            console.error("No user ID found for profile update");
            return;
        }

        const dataToUpdate = {
            ...formData,
            gender: parseInt(formData.gender),
            relationship_status: parseInt(formData.relationship_status),
        };



        updateProfileMutation.mutate({ userId: targetUserId, data: dataToUpdate }, {
            onSuccess: () => {
                toast.success(t('profile.update_success') || "Profile updated successfully!");
                onClose();
            },
            onError: (error) => {
                // Error handling via toast is done in interceptor/mutation, but we can do extra here if needed
                console.error("Failed to update profile", error);
            }
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop with Blur */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/30 backdrop-blur-md z-50 transition-all"
                    />

                    {/* Modal Window */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/40 shadow-2xl"
                        >
                            {/* Glassmorphism Background & Liquid Effects */}
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl z-0"></div>
                            
                            {/* Liquid Blobs */}
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full max-h-[85vh]">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
                                    <h2 className="text-xl font-semibold text-slate-800">Edit Profile</h2>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-slate-100/50 text-slate-500 hover:text-slate-800 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Form Body */}
                                <div className="overflow-y-auto px-6 py-6 custom-scrollbar">
                                    <form id="edit-profile-form" onSubmit={handleSubmit} className="flex flex-col gap-5">
                                        
                                        {/* Avatar Section */}
                                        <div className="flex justify-center mb-2">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-full p-[2px] bg-linear-to-tr from-purple-500 to-pink-500">
                                                    <div className="w-full h-full rounded-full border-2 border-white bg-slate-50 overflow-hidden">
                                                        {user?.avatar_data?.url ? (
                                                            <img src={user.avatar_data.url} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-2xl font-bold">
                                                                {user?.first_name ? user.first_name[0].toUpperCase() : 'U'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    className="absolute bottom-0 right-0 p-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all border-2 border-white shadow-sm"
                                                    title="Change Avatar"
                                                >
                                                    <Camera size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Name Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</label>
                                                <input
                                                    type="text"
                                                    name="first_name"
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                                    placeholder="Jane"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</label>
                                                <input
                                                    type="text"
                                                    name="last_name"
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all placeholder:text-slate-400 text-slate-800"
                                                    placeholder="Doe"
                                                />
                                            </div>
                                        </div>

                                        {/* Bio */}
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Bio</label>
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleChange}
                                                rows="4"
                                                className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all placeholder:text-slate-400 text-slate-800 resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        </div>

                                        {/* Meta Data Row */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {/* Gender */}
                                            <div className="space-y-1.5">
                                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                    <User size={14} />
                                                    Gender
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        name="gender"
                                                        value={formData.gender}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all appearance-none text-slate-800"
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value={GENDER.MALE}>Male</option>
                                                        <option value={GENDER.FEMALE}>Female</option>
                                                        <option value={GENDER.UNKOWN}>Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Relationship */}
                                            <div className="space-y-1.5">
                                                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                                    <Heart size={14} />
                                                    Status
                                                </label>
                                                <div className="relative">
                                                     <select
                                                        name="relationship_status"
                                                        value={formData.relationship_status}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 rounded-xl bg-white/50 border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all appearance-none text-slate-800"
                                                    >
                                                        <option value="">Select...</option>
                                                        <option value={RELATIONSHIP_STATUS.SINGLE}>Single</option>
                                                        <option value={RELATIONSHIP_STATUS.IN_RELATIONSHIP}>In a relationship</option>
                                                        <option value={RELATIONSHIP_STATUS.MARRIED}>Married</option>
                                                    </select>
                                            </div>
                                        </div>
                                        </div>

                                        {/* Privacy Settings */}
                                        <div className="space-y-3 pt-4 border-t border-slate-200/60">
                                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Privacy Settings</h3>
                                            
                                            {/* Helper component for Radio Group */}
                                            {['is_gender_public', 'is_email_public', 'is_rel_status_public', 'allow_direct_follows'].map((field) => (
                                                <div key={field} className="flex items-center justify-between bg-white/40 p-3 rounded-xl border border-white/50">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {field === 'allow_direct_follows' ? 'Allow Direct Follows' : 
                                                         field === 'is_gender_public' ? 'Public Gender' :
                                                         field === 'is_email_public' ? 'Public Email' : 'Public Relationship Status'}
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${formData[field] ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'text-slate-500 hover:bg-slate-100'}`}>
                                                            <input 
                                                                type="radio" 
                                                                name={field} 
                                                                value="true" 
                                                                checked={formData[field] === true} 
                                                                onChange={handleChange}
                                                                className="hidden" 
                                                            />
                                                            {field === 'allow_direct_follows' ? 'Yes' : 'Public'}
                                                        </label>
                                                        <label className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!formData[field] ? 'bg-slate-200 text-slate-700 border border-slate-300' : 'text-slate-500 hover:bg-slate-100'}`}>
                                                            <input 
                                                                type="radio" 
                                                                name={field} 
                                                                value="false" 
                                                                checked={formData[field] === false} 
                                                                onChange={handleChange}
                                                                className="hidden" 
                                                            />
                                                            {field === 'allow_direct_follows' ? 'No' : 'Private'}
                                                        </label>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                    </form>
                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-white/20 bg-white/30 flex justify-end gap-3">
                                    <button 
                                        type="button"
                                        onClick={onClose}
                                        className="px-5 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        type="submit" 
                                        form="edit-profile-form"
                                        disabled={isSaving}
                                        onClick={handleSubmit}
                                        className={`px-6 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-2 ${isSaving ? 'opacity-70 cursor-wait' : ''}`}
                                    >
                                        {isSaving ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {isSaving ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>

                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default EditProfileModal;
