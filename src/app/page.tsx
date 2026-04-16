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
    resetForm(); // Start fresh
    updateFormData({ type });
    router.push(`/submit/${type}`);
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white to-[var(--color-beige)]">
        <div className="w-full max-w-4xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white">
          <Stepper currentStep={1} />
          
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center p-2 shadow-sm border border-gray-100 mb-6">
              <img src="/fmac-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[var(--color-espresso)] mb-4 tracking-tighter uppercase text-center">
              {language === 'ar' ? 'نادي الفجيرة للفنون القتالية' : 'Fujairah Martial Arts Club'}
            </h1>
            <p className="text-[var(--color-espresso)] font-bold uppercase tracking-[0.3em] text-[10px] mb-8 opacity-60">
              {language === 'ar' ? 'قسم العمليات' : 'Operations Department'}
            </p>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
              {language === 'ar' 
                ? 'مرحباً بكم في المنصة الموحدة للاستفسارات والطلبات. يرجى اختيار الخدمة المطلوبة للمتابعة.' 
                : 'Welcome to the unified platform for inquiries and requests. Please select the service required to proceed.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleSelectService(service.id)}
                className="group relative bg-gray-50 hover:bg-[var(--color-espresso)] border border-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <service.icon className="w-8 h-8 text-[var(--color-terracotta)]" />
                </div>
                <span className="font-bold text-lg text-gray-700 group-hover:text-white transition-colors">
                  {language === 'ar' ? service.ar : service.en}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--color-terracotta)] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-b-2xl"></div>
              </button>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
