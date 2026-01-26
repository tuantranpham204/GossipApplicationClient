import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUpdateUserAvatarMutation } from '../../services/user.service';
import { toast } from 'sonner';

const AvatarUploadModal = ({ isOpen, onClose, user, userId }) => {
    const { t } = useTranslation();
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null);
    
    const updateAvatarMutation = useUpdateUserAvatarMutation();
    const isUploading = updateAvatarMutation.isPending;

    // Reset state when modal opens/closes
    useEffect(() => {
        if (!isOpen) {
            setSelectedFile(null);
            setPreviewUrl(null);
        } else {
            // Set initial preview to current avatar
            setPreviewUrl(user?.avatar_data?.url || user?.avatar_url || null);
        }
    }, [isOpen, user]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            // Basic validation for image type
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else {
                toast.error("Please upload an image file");
            }
        }
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSubmit = async () => {
        if (!selectedFile) {
            onClose(); // Just close if no new file selected
            return;
        }

        const targetId = userId || user?.id; // Use passed userId or fallback to user.id
        console.log("Submitting avatar update for:", targetId);

        updateAvatarMutation.mutate({ userId: targetId, file: selectedFile }, {
            onSuccess: () => {
                toast.success("Avatar updated successfully!");
                onClose();
            },
            onError: (err) => {
                 // Error handling is handled by interceptor ideally, but we catch here to stop loading state
                 // isUploading state is handled by mutation
            }
        });
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
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
                            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/40 shadow-2xl"
                        >
                            {/* Glassmorphism Background & Liquid Effects */}
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-xl z-0"></div>
                            
                            {/* Liquid Blobs */}
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-pink-400/30 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>

                            {/* Content */}
                            <div className="relative z-10 flex flex-col h-full">
                                
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
                                    <h2 className="text-xl font-semibold text-slate-800">Change Avatar</h2>
                                    <button 
                                        onClick={onClose}
                                        className="p-2 rounded-full hover:bg-slate-100/50 text-slate-500 hover:text-slate-800 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Body */}
                                <div className="px-8 py-8 flex flex-col items-center gap-6">
                                    
                                    {/* Preview Area / Drop Zone */}
                                    <div 
                                        className="relative group cursor-pointer"
                                        onClick={triggerFileSelect}
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                    >
                                        <div className="w-40 h-40 rounded-full p-[4px] bg-white shadow-xl shadow-purple-500/10 relative z-10">
                                            <div className="w-full h-full rounded-full overflow-hidden border-2 border-slate-100 relative bg-slate-50">
                                                {previewUrl ? (
                                                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                ) : (
                                                     <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <ImageIcon size={48} />
                                                     </div>
                                                )}
                                                
                                                {/* Hover Overlay */}
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2">
                                                    <Upload size={24} />
                                                    <span className="text-xs font-bold uppercase tracking-wider">Change</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Floating Decor */}
                                        <div className="absolute inset-0 bg-linear-to-tr from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity -z-10 scale-110"></div>
                                    </div>

                                    <div className="text-center space-y-1">
                                        <h3 className="text-slate-800 font-medium">Upload a new photo</h3>
                                        <p className="text-slate-500 text-sm">Drag and drop or click to browse</p>
                                    </div>
                                    
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />

                                </div>

                                {/* Footer */}
                                <div className="px-6 py-4 border-t border-white/20 bg-white/30 flex justify-end gap-3">
                                    <button 
                                        onClick={onClose}
                                        className="px-5 py-2 rounded-xl text-slate-600 font-semibold hover:bg-slate-100/50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSubmit}
                                        disabled={!selectedFile || isUploading}
                                        className={`px-6 py-2 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold hover:shadow-lg hover:shadow-purple-500/30 active:scale-95 transition-all flex items-center gap-2 ${(!selectedFile || isUploading) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {isUploading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Save size={18} />
                                        )}
                                        {isUploading ? 'Saving...' : 'Update Picture'}
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

export default AvatarUploadModal;
