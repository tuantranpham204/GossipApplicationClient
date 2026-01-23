import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="py-8 text-center text-slate-400 text-sm bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; {new Date().getFullYear()} Gossip Application. All rights reserved.</p>
        <p className="font-serif italic text-slate-300">"{t('quote') || "Truth is ... never simple."}"</p>
      </div>
    </footer>
  );
};

export default Footer;
