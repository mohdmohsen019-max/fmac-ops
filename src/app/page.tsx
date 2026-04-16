"use client";

import { useRequestStore, RequestType } from "@/store/requestStore";
import { Navigation } from "@/components/Navigation";
import { Stepper } from "@/components/Stepper";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  };

  return (
    <div 
      className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth bg-black overflow-x-hidden font-english" 
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="fixed top-0 left-0 w-full z-50">
        <Navigation />
      </div>
      
      {/* SECTION 1: HERO / WELCOME */}
      <section className="h-screen w-full snap-start relative flex flex-col items-center justify-center px-6 text-white text-center overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#D2122E_0%,_transparent_70%)]" />
          <div className="absolute inset-0 bg-[grid-white]/5 [mask-image:radial-gradient(white,transparent)]" />
        </motion.div>
        
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="relative z-10"
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-brand bg-brand/10 text-brand text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            {language === 'ar' ? 'البوابة الرسمية للعمليات' : 'Official Operations Portal'}
          </div>
          
          <h1 className="text-5xl md:text-9xl font-black mb-8 leading-[0.85] tracking-tighter uppercase max-w-6xl mx-auto">
            {language === 'ar' ? (
              <span className="font-arabic leading-tight">نادي الفجيرة للفنون القتالية</span>
            ) : (
              <>FUJAIRAH <br className="hidden md:block" /> MARTIAL ARTS CLUB</>
            )}
          </h1>
          
          <p className="text-xl md:text-3xl text-gray-400 font-medium max-w-2xl mx-auto mb-12">
            {language === 'ar' 
              ? 'نهدف إلى التميز في تقديم الخدمات الرقمية وتحسين تجربة المجتمع الرياضي في الفجيرة.'
              : 'Striving for excellence in digital operations and enhancing the martial arts experience in Fujairah.'}
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
            <div className="w-[2px] h-12 bg-gradient-to-b from-brand to-transparent rounded-full animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* SECTION 2: SERVICES GRID */}
      <section className="min-h-screen w-full snap-start bg-white py-24 px-6 relative">
        <div className="max-w-7xl mx-auto pt-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-16 border-b-4 border-black pb-8"
          >
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest text-black flex items-center gap-4">
               <span className="w-10 h-10 bg-brand flex items-center justify-center text-white text-xs">01</span>
               {language === 'ar' ? 'خدماتنا' : 'OUR SERVICES'}
            </h2>
            <div className="hidden md:block h-1 w-32 bg-gray-100" />
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12"
          >
            {services.map((service) => (
              <motion.button
                key={service.id}
                variants={cardVariants}
                onClick={() => handleSelectService(service.id)}
                className="group relative h-80 bg-white border-2 border-black p-10 rounded-[2.5rem] flex flex-col justify-between items-start transition-all duration-300 hover:bg-black hover:border-black hover:translate-y-[-10px] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)] active:scale-95 text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand text-white flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-400">
                  <service.icon className="w-8 h-8" />
                </div>
                
                <div className="space-y-3">
                  <h3 className={`text-2xl font-black uppercase leading-[1.1] text-black group-hover:text-white transition-colors ${language === 'ar' ? 'font-arabic text-right' : 'font-display'}`}>
                    {language === 'ar' ? service.ar : service.en}
                  </h3>
                  <div className="flex items-center gap-3 text-brand group-hover:text-white transition-all font-black text-[10px] uppercase tracking-widest translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-500">
                    {language === 'ar' ? 'ابدأ الآن' : 'Start Process'}
                    <span className="block w-6 h-[2px] bg-current" />
                  </div>
                </div>

                {/* Decorative Accent Symbol */}
                <div className="absolute top-8 right-10 text-5xl font-black text-gray-100 group-hover:text-white/5 transition-colors pointer-events-none select-none">
                   {service.id === 'inquiry' ? '?' : service.id === 'complaint' ? '!' : '/'}
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
