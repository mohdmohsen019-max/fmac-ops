"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRequestStore } from "@/store/requestStore";
import { Globe, Shield } from "lucide-react";

export function Navigation() {
  const { language, setLanguage } = useRequestStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between opacity-0">
          Loading...
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-6 group">
          <img src="/fmac-logo.png" alt="FMAC" className="w-16 h-16 object-contain transition-transform group-hover:scale-110" />
          <div className="flex flex-col">
            <span className={`${language === 'ar' ? 'font-arabic' : 'font-display'} font-black text-2xl text-black leading-none uppercase tracking-tighter`}>
              {language === 'ar' ? 'البوابة الموحدة' : 'UNIFIED PORTAL'}
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-xs font-black text-black uppercase tracking-widest hover:text-brand transition-colors">
            {language === 'ar' ? 'الإدارة' : 'Admin'}
          </Link>
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-all shadow-sm"
            title={language === 'ar' ? 'English' : 'عربي'}
          >
            <Globe className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
