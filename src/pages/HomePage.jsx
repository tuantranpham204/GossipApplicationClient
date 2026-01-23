import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  // Mock recommended users
  const recommendedUsers = [
    { id: 1, name: 'Andrew Ui', username: '@Andrew.ui', role: 'Top Contributor', avatar: 'https://ui-avatars.com/api/?name=Andrew+Ui&background=0D8ABC&color=fff' },
    { id: 2, name: 'Sarah Chen', username: '@sarah.gossip', role: 'Insider', avatar: 'https://ui-avatars.com/api/?name=Sarah+Chen&background=E11D48&color=fff' },
    { id: 3, name: 'Mike Ross', username: '@fake.lawyer', role: 'Newbie', avatar: 'https://ui-avatars.com/api/?name=Mike+Ross&background=7C3AED&color=fff' },
    { id: 4, name: 'Rachel Z', username: '@rachel.z', role: 'VIP', avatar: 'https://ui-avatars.com/api/?name=Rachel+Z&background=F59E0B&color=fff' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans text-slate-900 flex flex-col">
      
      {/* Reusable Header */}
      <Header />

      <main className="flex-1">
        {/* Welcome Section (Only for non-logged in users) */}
        {!user ? (
          <section className="relative pt-20 pb-32 px-6 overflow-hidden">
             {/* Abstract Background Elements */}
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-10 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
             </div>
  
             <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h1 className="font-serif text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
                    {t('quote') || "Truth is rarely pure and never simple."}
                  </h1>
                  <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {t('create_account_desc') || "Join the circle where secrets are currency and truth is the ultimate luxury."}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link 
                      to="/sign-up" 
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-xl shadow-purple-600/30 hover:scale-105 transition-transform"
                    >
                      {t('join_circle') || "Start Gossiping"}
                    </Link>
                    <Link 
                      to="/sign-in"
                      className="px-8 py-4 rounded-xl bg-white text-slate-700 font-bold text-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                      {t('hello_insider') || "Welcome Back"}
                    </Link>
                  </div>
                </motion.div>
             </div>
          </section>
        ) : (
          /* Logged In User View */
          <section className="pt-12 pb-8 px-6">
             <div className="max-w-7xl mx-auto">
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
                >
                   <div>
                      <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">
                         {t('hello') || "Welcome back,"} {user.firstName || "Insider"}
                      </h1>
                      <p className="text-slate-500 mt-1">
                         {user.role === 2 ? "Administrator Access" : "Ready to spill the tea?"}
                      </p>
                   </div>

                   {user.role === 2 && (
                      <div className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-bold text-sm border border-purple-200">
                         Admin Dashboard Active
                      </div>
                   )}
                </motion.div>
             </div>
          </section>
        )}
  
        {/* Recommended Users Section */}
        <section className="py-20 px-6 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                  {t('featured_insider') || "Recommended Insiders"}
                </h2>
                <p className="text-slate-500">
                  {user ? "People you should know." : "Top contributors in the circle."}
                </p>
              </div>
              <button className="text-purple-600 font-bold hover:text-pink-600 transition-colors text-sm">
                View All
              </button>
            </div>
  
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedUsers.map((u, index) => (
                <motion.div 
                  key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-purple-100 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300"
                >
                  <div className="absolute top-4 right-4">
                    <button className="h-8 w-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-pink-500 hover:border-pink-200 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </button>
                  </div>
  
                  <div className="flex flex-col items-center text-center">
                    <div className="h-24 w-24 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-pink-500 mb-4 group-hover:scale-105 transition-transform duration-300">
                      <img src={u.avatar} alt={u.name} className="h-full w-full rounded-full object-cover bg-white" />
                    </div>
                    
                    <h3 className="font-bold text-slate-900 text-lg">{u.name}</h3>
                    <p className="text-purple-600 text-sm font-medium mb-1">{u.role}</p>
                    <p className="text-slate-400 text-xs mb-6">{u.username}</p>
                    
                    <button className="w-full py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all">
                      Follow
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Reusable Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
