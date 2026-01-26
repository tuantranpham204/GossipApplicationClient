import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useUsersQuery } from '../services/user.service';
import { Link } from 'react-router-dom';

const SearchUsersPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: users, isLoading, error } = useUsersQuery(searchQuery);

  // Debounce search could be added here, but for now direct state usually works fine for small apps or with react-query's default behavior
  
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="mb-10 text-center">
            <h1 className="font-serif text-4xl font-bold text-slate-900 mb-4">
              {t('discover_insiders') || "Discover Insiders"}
            </h1>
            <p className="text-slate-500 mb-8 max-w-2xl mx-auto">
              {t('search_users_desc') || "Find friends, influencers, and top contributors within the circle."}
            </p>

            <div className="relative max-w-xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-white shadow-sm"
                placeholder={t('search_placeholder') || "Search by name or username..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {users?.data?.map((u, index) => (
                <motion.div 
                  key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-white rounded-2xl p-6 border border-slate-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 rounded-full p-1 bg-linear-to-tr from-purple-500 to-pink-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt={u.username} className="h-full w-full rounded-full object-cover bg-white" />
                      ) : (
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-2xl font-bold text-purple-600">
                          {u.firstName ? u.firstName[0].toUpperCase() : (u.username ? u.username[0].toUpperCase() : 'U')}
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-lg">{u.firstName} {u.lastName}</h3>
                    <Link to={`/profile/guest/${u.id}`} className="text-slate-400 text-sm mb-4 hover:text-purple-600 transition-colors">
                      @{u.username}
                    </Link>
                    
                    <Link to={`/profile/guest/${u.id}`} className="w-full py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all block">
                      View Profile
                    </Link>
                  </div>
                </motion.div>
              ))}
              
              {!isLoading && users?.data?.length === 0 && (
                <div className="col-span-full text-center py-10 text-slate-500">
                  No users found matching "{searchQuery}"
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
