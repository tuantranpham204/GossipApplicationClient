import React, { useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Settings,
  Grid,
  Bookmark,
  UserSquare,
  MoreHorizontal,
  Heart,
  MessageCirclePlus,
  Mail,
  Pencil,
  Archive,
  User,
  Lock,
  Camera,
  UserPlus,
  Bell,
  CopyPlus,
  Send,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  useHostProfileQuery,
  useGuestProfileQuery,
} from "../services/user.service";
import EditProfileModal from "../components/profile/EditProfileModal";
import AvatarUploadModal from "../components/profile/AvatarUploadModal";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ProfilePage = () => {
  const { userId } = useParams();
  const { t } = useTranslation();
  const location = useLocation();

  // Determine if this is a host view or guest view based on URL path
  const isHost = location.pathname.includes("/profile/host/");
  const isGuest = location.pathname.includes("/profile/guest/");

  // Conditionally fetch based on access type
  const hostQuery = useHostProfileQuery(userId, { enabled: isHost });
  const guestQuery = useGuestProfileQuery(userId, { enabled: isGuest });

  const {
    data: userProfile,
    isLoading,
    error,
  } = isHost ? hostQuery : guestQuery;

  const [activeTab, setActiveTab] = useState("posts");
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 text-slate-500">
        <p>Failed to load profile.</p>
        <Link
          to="/"
          className="text-blue-500 font-semibold hover:text-blue-700"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const user = userProfile;

  const tabs = [
    { id: "posts", icon: Grid, label: "POSTS" },
    { id: "saved", icon: Bookmark, label: "SAVED" },
    { id: "tagged", icon: UserSquare, label: "TAGGED" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-12 sm:mb-16">
          {/* Avatar Column */}
          <div className="flex-shrink-0 md:mx-0 mx-auto">
            <div className="relative w-24 h-24 md:w-40 md:h-40 rounded-full p-[2px] bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full border-2 border-white bg-slate-50 overflow-hidden">
                {user.avatar_data?.url ? (
                  <img
                    src={user.avatar_data.url}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-4xl font-bold">
                    {user.first_name ? user.first_name[0].toUpperCase() : "U"}
                  </div>
                )}
              </div>

              {isHost && (
                <button
                  className="absolute bottom-0 right-0 p-2 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-purple-500/30 transition-all border-2 border-white shadow-sm"
                  title="Change Avatar"
                  onClick={() => setIsAvatarModalOpen(true)}
                >
                  <Camera size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Info Column */}
          <div className="flex-1 flex flex-col gap-5 w-full">
            {/* Top Row: Username & Actions */}
            <div className="flex flex-col justify-between md:flex-row items-center md:items-start gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="text-xl md:text-2xl font-light text-slate-800">
                  {user.username}
                </h1>
                <span className="text-sm font-medium text-slate-600 block md:hidden">
                  {user.first_name} {user.last_name}
                </span>
              </div>

              {isHost ? (
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-slate-800 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Profile"
                    onClick={() => setIsEditProfileOpen(true)}
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    className="p-2 text-slate-800 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Archive"
                  >
                    <Archive size={20} />
                  </button>
                  <button
                    className="p-2 text-slate-800 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Settings"
                  >
                    <Settings size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 text-slate-800 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Follow"
                  >
                    <CopyPlus size={20} />
                  </button>
                  <button
                    className="p-2 text-slate-800 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Message"
                  >
                    <MessageCirclePlus size={20} />
                  </button>
                  <button
                    className="p-2 text-slate-800 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Add Friend"
                  >
                    <UserPlus size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Middle Row: Stats */}
            <ul className="flex justify-center md:justify-start items-center gap-8 text-base">
              <li className="flex gap-1">
                <span className="font-semibold text-slate-900">
                  {user.posts_amt || -1}
                </span>
                <span className="text-slate-600">posts</span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold text-slate-900">
                  {user.friends_amt || 0}
                </span>
                <span className="text-slate-600">friends</span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold text-slate-900">
                  {user.followers_amt || 0}
                </span>
                <span className="text-slate-600">followers</span>
              </li>
              <li className="flex gap-1">
                <span className="font-semibold text-slate-900">
                  {user.following_amt || 0}
                </span>
                <span className="text-slate-600">following</span>
              </li>
            </ul>

            {/* Bottom Row: Bio */}
            <div className="text-center md:text-left mt-4 w-full">
              <h2 className="hidden md:block font-semibold text-slate-900 text-base mb-2">
                {user.first_name} {user.last_name}
              </h2>
              <p className="text-slate-600 whitespace-pre-wrap text-sm leading-relaxed">
                {user.bio || t("no_bio")}
              </p>

              {/* Additional Details */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                {(isHost || user.is_email_public) && user.email && (
                  <div
                    className="flex items-center gap-2"
                    title={user.is_email_public ? "Email" : "Private Email"}
                  >
                    {user.is_email_public ? (
                      <Mail size={16} className="text-slate-400" />
                    ) : (
                      <Lock size={16} className="text-slate-400" />
                    )}
                    <span
                      className={`font-medium ${user.is_email_public ? "text-slate-700" : "text-slate-400"}`}
                    >
                      {user.email}
                    </span>
                  </div>
                )}

                {(isHost || user.is_gender_public) &&
                  user.gender !== null &&
                  user.gender !== undefined && (
                    <div
                      className="flex items-center gap-2 capitalize"
                      title={
                        user.is_gender_public ? "Gender" : "Private Gender"
                      }
                    >
                      {user.is_gender_public ? (
                        <User size={16} className="text-slate-400" />
                      ) : (
                        <Lock size={16} className="text-slate-400" />
                      )}
                      <span
                        className={`font-medium ${user.is_gender_public ? "text-slate-700" : "text-slate-400"}`}
                      >
                        {user.gender}
                      </span>
                    </div>
                  )}

                {(isHost || user.is_rel_status_public) &&
                  user.relationship_status !== null &&
                  user.relationship_status !== undefined && (
                    <div
                      className="flex items-center gap-2 capitalize"
                      title={
                        user.is_rel_status_public
                          ? "Relationship Status"
                          : "Private Relationship Status"
                      }
                    >
                      {user.is_rel_status_public ? (
                        <Heart size={16} className="text-slate-400" />
                      ) : (
                        <Lock size={16} className="text-slate-400" />
                      )}
                      <span
                        className={`font-medium ${user.is_rel_status_public ? "text-slate-700" : "text-slate-400"}`}
                      >
                        {user.relationship_status}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Tabs */}
        <div className="border-t border-slate-200">
          <div className="flex justify-center gap-12">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                                        flex items-center gap-2 py-4 border-t -mt-px text-xs tracking-widest font-semibold transition-colors
                                        ${isActive ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}
                                    `}
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Grid */}
        {activeTab === "posts" ? (
          <div className="grid grid-cols-3 gap-1 sm:gap-4 mt-2">
            {/* Placeholder Items */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="aspect-square relative group bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer overflow-hidden"
              >
                {/* Placeholder Image - would be post.image_url */}
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                  <Grid size={32} />
                </div>

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                  <div className="flex items-center gap-2">
                    <Heart size={20} fill="white" />
                    <span>124</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageCirclePlus size={20} fill="white" />
                    <span>12</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <div className="w-16 h-16 rounded-full border-2 border-slate-300 flex items-center justify-center mb-4">
              {activeTab === "saved" && <Bookmark size={32} strokeWidth={1} />}
              {activeTab === "tagged" && (
                <UserSquare size={32} strokeWidth={1} />
              )}
            </div>
            <h3 className="text-2xl font-light text-slate-800 mb-2">
              {activeTab === "saved" ? "Saved" : "Photos of you"}
            </h3>
            <p className="max-w-xs text-center text-sm">
              {activeTab === "saved"
                ? "Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved."
                : "When people tag you in photos, they'll appear here."}
            </p>
          </div>
        )}
      </main>

      <Footer />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
      />

      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        user={user}
        userId={userId}
      />
    </div>
  );
};

export default ProfilePage;
