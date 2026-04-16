"use client";

import { useEffect, useState } from "react";
import { useRequestStore } from "@/store/requestStore";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const language = useRequestStore((state) => state.language);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }, [language, mounted]);

  // To prevent hydration errors, we can just render children directly,
  // but we might want to avoid flashing content. Simple setup is fine.
  return <>{children}</>;
}
