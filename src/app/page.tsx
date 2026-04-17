"use client";

import { useRequestStore, RequestType } from "@/store/requestStore";
import { Navigation } from "@/components/Navigation";
import { Stepper } from "@/components/Stepper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  MessageSquare, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  PhoneCall, 
  Wrench 
} from "lucide-react";

const services: { id: RequestType; icon: any; en: string; ar: string }[] = [
  { id: 'inquiry', icon: MessageSquare, en: 'Inquiry', ar: 'استفسار' },
  { id: 'complaint', icon: AlertTriangle, en: 'Complaint', ar: 'شكوى' },
  { id: 'suggestion', icon: Lightbulb, en: 'Suggestion', ar: 'اقتراح' },
  { id: 'meeting', icon: Users, en: 'Meeting Request', ar: 'طلب اجتماع' },
  { id: 'call', icon: PhoneCall, en: 'Phone Call', ar: 'مكالمة هاتفية' },
  { id: 'maintenance', icon: Wrench, en: 'Maintenance', ar: 'صيانة' },
];

export default function Home() {
  const { language, updateFormData, resetForm } = useRequestStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSelectService = (type: RequestType) => {
    resetForm();
    updateFormData({ type });
    router.push(`/submit/${type}`);
  };

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      }
    },
  } as const;

  return (
    <div 
      className={`h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-black overflow-x-hidden ${language === 'ar' ? 'font-arabic' : 'font-english'}`}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="fixed top-0 left-0 w-full z-50">
        <Navigation />
      </div>
      
      {/* SECTION 1: HERO / WELCOME */}
      <section className="h-screen w-full snap-start relative flex flex-col items-center justify-center px-6 text-white text-center overflow-hidden">
        {/* Cinematic Background Layers */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="hero-mesh animate-mesh" />
          <motion.div 
            style={{ y }}
            className="absolute inset-0 z-0 opacity-15 grayscale"
          >
            <img 
              src="file:///C:/Users/HP/.gemini/antigravity/brain/dd7a0113-1121-455d-b799-1c12a10a1396/dojo_subtle_texture_1776431246858.png" 
              alt="" 
              className="w-full h-full object-cover"
            />
          </motion.div>
          <div className="noise-overlay" />
          <div className="hero-vignette" />
        </div>
        
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative z-10 w-full"
        >
          
          <h1 className="text-5xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter uppercase max-w-6xl mx-auto">
            {language === 'ar' ? (
              <span className="font-arabic leading-tight">نادي الفجيرة للفنون القتالية</span>
            ) : (
              <>FUJAIRAH <br className="hidden md:block" /> MARTIAL ARTS CLUB</>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-xl mx-auto mb-12">
            {language === 'ar' 
              ? 'نهدف إلى التميز في تقديم الخدمات الرقمية الموحدة وتحسين تجربة المجتمع الرياضي في الفجيرة.'
              : 'Striving for excellence in unified digital services and enhancing the martial arts experience in Fujairah.'}
          </p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1.5 }}
            className="flex flex-col items-center gap-4 mt-8"
          >
            <span className="text-[10px] uppercase font-black tracking-[0.4em] text-gray-500">
              {language === 'ar' ? 'مرر للخدمات' : 'Scroll for Services'}
            </span>
            <div className="w-[1px] h-16 bg-gradient-to-b from-brand via-brand/50 to-transparent relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, 64] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-white to-transparent"
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: SERVICES GRID */}
      <section className="min-h-screen w-full snap-start scroll-mt-20 bg-white pt-28 pb-12 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-12 border-b-4 border-black pb-8"
          >
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-black flex items-center gap-4">
               {language === 'ar' ? 'خدماتنا' : 'OUR SERVICES'}
            </h2>
            <div className="hidden md:block h-1 w-32 bg-gray-100" />
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 pb-12"
          >
            {services.map((service) => (
              <motion.button
                key={service.id}
                variants={cardVariants}
                onClick={() => handleSelectService(service.id)}
                className="group relative h-40 md:h-72 bg-white border-2 border-black p-4 md:p-10 rounded-2xl md:rounded-[2.5rem] flex flex-col justify-between items-start transition-all duration-300 hover:bg-black hover:border-black hover:translate-y-[-5px] md:hover:translate-y-[-10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)] active:scale-95 text-left"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-brand text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-400">
                  <service.icon className="w-5 h-5 md:w-8 md:h-8" />
                </div>
                
                <div className="space-y-1.5 md:space-y-3">
                  <h3 className={`text-sm md:text-2xl font-black uppercase leading-[1.1] text-black group-hover:text-white transition-colors ${language === 'ar' ? 'font-arabic text-right' : 'font-display'}`}>
                    {language === 'ar' ? service.ar : service.en}
                  </h3>
                  <div className="flex items-center gap-1.5 md:gap-3 text-brand group-hover:text-white transition-all font-black text-[7px] md:text-[10px] uppercase tracking-widest translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-500">
                    {language === 'ar' ? 'ابدأ' : 'Start'}
                    <span className="block w-4 md:w-6 h-[1.5px] md:h-[2px] bg-current" />
                  </div>
                </div>

              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
