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
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-gray-100 overflow-hidden group-hover:border-brand transition-colors">
            <img src="/fmac-logo.png" alt="FMAC" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-xl text-black leading-none uppercase tracking-tighter">
              {language === 'ar' ? 'نادي الفجيرة للفنون القتالية' : 'FUJAIRAH MARTIAL ARTS CLUB'}
            </span>
            <span className="text-[10px] font-black text-brand uppercase tracking-[0.3em] mt-1 opacity-80">
              {language === 'ar' ? 'بوابة الخدمات' : 'Service Portal'}
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/admin" className="text-xs font-black text-black uppercase tracking-widest hover:text-brand transition-colors">
            {language === 'ar' ? 'الإدارة' : 'Admin'}
          </Link>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-black bg-white hover:bg-black hover:text-white transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Globe className="w-3.5 h-3.5" />
            {language === 'ar' ? 'English' : 'عربي'}
          </button>
        </div>
      </div>
    </nav>
  );
}
