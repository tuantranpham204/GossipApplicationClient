import {
  Newspaper,
  Users,
  Heart,
  UserPlus,
  Bell,
  LogOut,
  User,
  Search,
  MessageCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../store/useAuthStore";
import { useSignOutMutation } from "../../services/auth.service"; // Import the hook
import { useUserAvatarQuery } from "../../services/user.service";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import LanguageSwitcher from "../ui/LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  const signOutMutation = useSignOutMutation(); // Use the hook

  // Fetch fresh avatar
  const { data: avatarData, refetch: refetchAvatar } = useUserAvatarQuery(
    user?.id,
  );

  // Refetch avatar on navigation
  useEffect(() => {
    if (user?.id) {
      refetchAvatar();
    }
  }, [location.pathname, user?.id, refetchAvatar]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="relative z-50 w-full px-8 py-6 flex justify-between items-center bg-white/60 backdrop-blur-xl sticky top-0 border-b border-white/20 transition-all duration-300 shadow-sm">
      {/* Left: Logo & Brand */}
      <div className="flex items-center gap-2 z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src={logo}
            alt="Gossip Logo"
            className="h-14 w-auto group-hover:scale-110 transition-transform duration-300 drop-shadow-sm"
          />
          {!user && (
            <span className="font-brand text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 hidden sm:block tracking-wide">
              Gossip.
            </span>
          )}
        </Link>
      </div>

      {/* Center: Navigation Icons (Logged In Only) */}
      {user && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4">
          {[
            { path: "/search", icon: Search, title: "Search" },
            { path: "/messages", icon: MessageCircle, title: "Messages" },
            { path: "/feed", icon: Newspaper, title: "Posts" },
            { path: "/follows", icon: Heart, title: "Follows" },
            { path: "/friends", icon: Users, title: "Friends" },
            {
              path: "/requests",
              icon: UserPlus,
              title: "Requests",
              badge: true,
            },
            { path: "/notifications", icon: Bell, title: "Notifications" },
          ].map((item) => (
            <Link key={item.path} to={item.path} className="relative group">
              <motion.div
                whileHover={{
                  scale: 1.1,
                  paddingBottom: "8px",
                  paddingTop: "8px",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className={`px-4 py-2 rounded-2xl transition-all duration-300 flex flex-col items-center justify-center min-w-[60px] ${
                  isActive(item.path)
                    ? "bg-linear-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "text-slate-400 hover:text-purple-600 hover:bg-white/80"
                }`}
              >
                <item.icon
                  size={22}
                  strokeWidth={isActive(item.path) ? 2.5 : 2}
                />

                <span className="text-[10px] font-bold uppercase tracking-wider max-h-0 opacity-0 group-hover:max-h-[20px] group-hover:opacity-100 group-hover:mt-1 transition-all duration-300 overflow-hidden whitespace-nowrap">
                  {item.title}
                </span>

                {/* Notification Dot */}
                {item.badge && (
                  <span className="absolute top-2 right-3 w-2 h-2 bg-pink-500 rounded-full border border-white group-hover:opacity-0 transition-opacity"></span>
                )}
              </motion.div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-2xl bg-purple-400/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110"></div>
            </Link>
          ))}
        </div>
      )}

      {/* Right: Language & User Actions */}
      <div className="flex items-center gap-6 z-20">
        <LanguageSwitcher />

        {!user ? (
          <div className="flex items-center gap-3">
            <Link
              to="/sign-in"
              className="text-sm font-semibold text-slate-600 hover:text-purple-600 transition-colors"
            >
              {t("sign_in") || "Sign In"}
            </Link>
            <Link
              to="/sign-up"
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-95"
            >
              {t("apply_access") || "Get Access"}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Admin Dashboard Icon (only for Admin) */}
            {user?.role === 2 && (
              <Link
                to="/admin/dashboard"
                className="hidden md:flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-purple-600 uppercase tracking-wider border border-slate-200 px-3 py-1 rounded-lg hover:border-purple-200 transition-colors"
              >
                Dashboard
              </Link>
            )}

            {/* User Avatar Dropdown */}
            <div
              className="relative z-30"
              onMouseEnter={() => setIsProfileOpen(true)}
              onMouseLeave={() => setIsProfileOpen(false)}
            >
              <Link to={`/profile/host/${user.id}`} className="block relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="h-11 w-11 rounded-full bg-linear-to-tr from-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/20"
                >
                  <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-sm font-bold text-purple-600 relative overflow-hidden">
                    {avatarData?.url ? (
                      <img
                        src={avatarData.url}
                        alt={user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.firstName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span>
                        {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                      </span>
                    )}
                  </div>
                </motion.div>
              </Link>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden p-1.5 flex flex-col gap-1"
                  >
                    <Link
                      to={`/profile/host/${user.id}`}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group"
                    >
                      <User
                        size={18}
                        strokeWidth={2}
                        className="text-slate-400 group-hover:text-purple-600"
                      />
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        signOutMutation.mutate(undefined, {
                          onSuccess: () => {
                            navigate("/sign-in");
                          },
                        });
                      }}
                      disabled={signOutMutation.isPending}
                      className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors w-full text-left group disabled:opacity-50"
                    >
                      <LogOut
                        size={18}
                        strokeWidth={2}
                        className="text-red-400 group-hover:text-red-500"
                      />
                      {signOutMutation.isPending
                        ? "Signing Out..."
                        : "Sign Out"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
