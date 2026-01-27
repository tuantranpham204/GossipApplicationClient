import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
  Search,
  UserPlus,
  CopyPlus,
  MessageCirclePlus,
  User,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useProfilesByQuery } from "../services/user.service";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SearchUsersPage = () => {
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const {
    data: response,
    isLoading,
    error,
  } = useProfilesByQuery(searchQuery, page, 12);

  const profiles = response?.data || [];
  const meta = response?.meta || {};
  const totalPages = meta.pagination?.total_pages || meta.total_pages || 1; // Handle likely structures

  // Debounce search could be added here, but for now direct state usually works fine for small apps or with react-query's default behavior

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full pl-11 pr-10 py-3 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white shadow-sm"
                placeholder={
                  t("search_placeholder") || "Search by name or username..."
                }
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to page 1 on search
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setPage(1);
                  }}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : error ? (
            <div className="text-center py-20 text-red-500">
              <p>Error loading users. Please try again.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {profiles.map((profile, index) => {
                  return (
                    <motion.div
                      key={profile.user_id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="h-24 w-24 rounded-full p-1 bg-linear-to-tr from-purple-500 to-pink-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                          {profile.avatar_data?.url != undefined ? (
                            <img
                              src={profile.avatar_data.url}
                              alt={profile.username}
                              className="h-full w-full rounded-full object-cover bg-white"
                            />
                          ) : (
                            <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-2xl font-bold text-purple-600">
                              {profile.first_name
                                ? profile.first_name[0].toUpperCase()
                                : profile.username
                                  ? profile.username[0].toUpperCase()
                                  : "U"}
                            </div>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-900 text-lg">
                          {profile.first_name} {profile.last_name}
                        </h3>
                        {user.id == profile.user_id ? (
                          <Link
                            to={`/profile/host/${profile.user_id}`}
                            className="text-slate-400 text-sm mb-4 hover:text-purple-600 transition-colors"
                          >
                            @{profile.username}
                          </Link>
                        ) : (
                          <Link
                            to={`/profile/guest/${profile.user_id}`}
                            className="text-slate-400 text-sm mb-4 hover:text-purple-600 transition-colors"
                          >
                            @{profile.username}
                          </Link>
                        )}

                        <div className="flex justify-center gap-2 mt-2">
                          <Link
                            to={
                              user.id == profile.user_id
                                ? `/profile/host/${profile.user_id}`
                                : `/profile/guest/${profile.user_id}`
                            }
                            className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                            title="View Profile"
                          >
                            <User size={20} />
                          </Link>

                          {user.id !== profile.user_id && (
                            <>
                              <button
                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                title="Add Friend"
                              >
                                <UserPlus size={20} />
                              </button>
                              <button
                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                title="Follow"
                              >
                                <CopyPlus size={20} />
                              </button>
                              <button
                                className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                                title="Chat"
                              >
                                <MessageCirclePlus size={20} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}

                {!isLoading && profiles.length === 0 && (
                  <div className="col-span-full text-center py-10 text-slate-500">
                    No users found matching "{searchQuery}"
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="text-sm font-medium text-slate-600">
                    Page {page} of {totalPages}
                  </span>

                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-full border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-slate-600"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SearchUsersPage;
