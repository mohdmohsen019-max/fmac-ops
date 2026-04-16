"use client";

import { useRequestStore, RequestType } from "@/store/requestStore";
import { Navigation } from "@/components/Navigation";
import { Stepper } from "@/components/Stepper";
import { useRouter } from "next/navigation";
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

  const handleSelectService = (type: RequestType) => {
    resetForm();
    updateFormData({ type });
    router.push(`/submit/${type}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-english" dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden bg-black text-white">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_#D2122E_0%,_transparent_50%)]" />
          <div className="absolute inset-0 bg-[grid-white]/5 [mask-image:radial-gradient(white,transparent)]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-brand bg-brand/10 text-brand text-[10px] font-black uppercase tracking-[0.3em] mb-8">
            {language === 'ar' ? 'البوابة الرسمية للعمليات' : 'Official Operations Portal'}
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter uppercase max-w-5xl mx-auto">
            {language === 'ar' ? (
              <span className="font-arabic leading-tight">نادي الفجيرة للفنون القتالية</span>
            ) : (
              <>FUJAIRAH <br className="hidden md:block" /> MARTIAL ARTS CLUB</>
            )}
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto mb-12">
            {language === 'ar' 
              ? 'نهدف إلى التميز في تقديم الخدمات الرقمية وتحسين تجربة المجتمع الرياضي في الفجيرة.'
              : 'Striving for excellence in digital operations and enhancing the martial arts experience in Fujairah.'}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="flex-1 py-12 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12 border-b-4 border-black pb-6">
            <h2 className="text-2xl font-black uppercase tracking-widest text-black flex items-center gap-4">
               <span className="w-8 h-8 bg-brand flex items-center justify-center text-white text-xs">01</span>
               {language === 'ar' ? 'اختر الخدمة المطلوبة' : 'SELECT SERVICE'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className="group relative h-72 bg-white border-2 border-black p-8 rounded-[2rem] flex flex-col justify-between items-start transition-all duration-300 hover:bg-brand hover:border-brand hover:translate-y-[-8px] hover:shadow-[0_20px_40px_rgba(210,18,46,0.2)] active:scale-95"
              >
                <div className="w-16 h-16 rounded-2xl bg-black text-white flex items-center justify-center group-hover:bg-white group-hover:text-brand transition-colors duration-300">
                  <service.icon className="w-8 h-8" />
                </div>
                
                <div className="space-y-2 text-left">
                  <h3 className={`text-2xl font-black uppercase leading-none group-hover:text-white transition-colors ${language === 'ar' ? 'font-arabic text-right' : 'font-display'}`}>
                    {language === 'ar' ? service.ar : service.en}
                  </h3>
                  <div className="flex items-center gap-2 text-brand group-hover:text-white transition-colors font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                    {language === 'ar' ? 'ابدأ الآن' : 'Start Request'}
                    <span className="block w-4 h-0.5 bg-current" />
                  </div>
                </div>

                {/* Decorative Accent */}
                <div className="absolute top-6 right-8 text-4xl font-black text-gray-100 group-hover:text-white/20 transition-colors pointer-events-none">
                   {service.id === 'inquiry' ? '?' : service.id === 'complaint' ? '!' : '#'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
