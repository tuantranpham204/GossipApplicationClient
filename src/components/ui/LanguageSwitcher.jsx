import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English (US)', short: 'US', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', short: 'VI', flag: '🇻🇳' }
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language);

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-sm font-bold text-slate-600 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm h-10"
      >
        <span className="text-xs font-black tracking-widest">{currentLang?.short}</span>
        
        <AnimatePresence>
            {isOpen && (
                <motion.span
                    initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                    animate={{ width: "auto", opacity: 1, marginLeft: 6 }}
                    exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                    className="overflow-hidden whitespace-nowrap text-xs font-semibold text-slate-500 border-l border-slate-300 pl-2"
                >
                    {currentLang?.name}
                </motion.span>
            )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-2 min-w-[140px] bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50 p-1.5 overflow-hidden z-50 flex flex-col gap-1"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-full px-3 py-2 text-left text-xs font-bold rounded-lg transition-all flex items-center justify-between group ${
                    i18n.language === lang.code 
                    ? 'bg-purple-50 text-purple-600' 
                    : 'text-slate-500 hover:text-purple-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                    <span className="font-black text-[10px] uppercase tracking-wider opacity-70">{lang.short}</span>
                    <span>{lang.name}</span>
                </div>
                {i18n.language === lang.code && (
                    <motion.div layoutId="activeLang" className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
