"use client";

import Link from "next/link";
import { useRequestStore } from "@/store/requestStore";
import { Globe, Shield } from "lucide-react";

export function Navigation() {
  const { language, setLanguage } = useRequestStore();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-sm border border-gray-100 overflow-hidden">
            <img src="/fmac-logo.png" alt="FMAC" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg text-[var(--color-espresso)] leading-none uppercase">
              {language === 'ar' ? 'نادي الفجيرة للفنون القتالية' : 'Fujairah Martial Arts Club'}
            </span>
          </div>
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-sm font-semibold text-gray-600 hover:text-[var(--color-terracotta)]">
            {language === 'ar' ? 'الإدارة' : 'Admin'}
          </Link>
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-sm font-semibold text-[var(--color-espresso)]"
          >
            <Globe className="w-4 h-4" />
            {language === 'ar' ? 'EN' : 'عربي'}
          </button>
        </div>
      </div>
    </nav>
  );
}
