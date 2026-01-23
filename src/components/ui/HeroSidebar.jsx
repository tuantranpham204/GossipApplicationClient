import React from 'react';
import { useTranslation } from 'react-i18next';
import downloadBg from '../../assets/download.png';

const HeroSidebar = () => {
  const { t } = useTranslation();
  return (
    <div 
      className="hidden md:flex md:w-1/2 lg:w-5/12 relative text-white flex-col justify-between p-12 shadow-2xl z-10"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 50%, rgba(0,0,0,0.6)), url(${downloadBg})`,
        backgroundColor: '#0f172a',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Large watermark letter */}
      <div className="absolute -bottom-20 -right-20 text-purple-500/5 font-serif text-[400px] pointer-events-none select-none z-0 font-bold">
        G
      </div>

      {/* Top content */}
      <div className="relative z-10">
        <p className="uppercase tracking-widest text-xs font-semibold opacity-80 mb-2">{t('exclusive_access')}</p>
        <h2 className="font-serif text-3xl italic leading-snug text-white">
          {t('quote')}
        </h2>
      </div>

      {/* Featured user card */}
      <div className="relative z-10 flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 w-max hover:bg-white/20 transition-all cursor-pointer">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-0.5">
          <img 
            src="../src/assets/defaultAvatar.jpg"
            alt="Featured Insider" 
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-bold text-white">{t('featured_insider')}</p>
          <p className="text-xs text-slate-300">@Andrew.ui • {t('top_contributor')}</p>
        </div>
        <div className="ml-4 h-8 w-8 rounded-full border border-white/30 flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HeroSidebar;
