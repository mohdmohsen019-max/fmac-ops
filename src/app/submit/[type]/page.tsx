"use client";

import { useRequestStore, RequestType } from "@/store/requestStore";
import { Navigation } from "@/components/Navigation";
import { Stepper } from "@/components/Stepper";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CustomSelect } from "@/components/CustomSelect";

export default function BasicInfoForm() {
  const { language, formData, updateFormData } = useRequestStore();
  const router = useRouter();
  const params = useParams();
  const type = params.type as RequestType;

  useEffect(() => {
    if (!type) router.push('/');
    if (formData.type !== type) {
      updateFormData({ type });
    }
  }, [type, formData.type, router, updateFormData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/submit/${type}/details`);
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 flex flex-col items-center py-10 px-6 bg-[var(--color-bg)]">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <Stepper currentStep={2} />
          
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--color-espresso)]">
              {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
            </h2>
            <p className="text-gray-500 mt-2">
              {language === 'ar' ? 'يرجى إدخال بياناتك للتواصل معك' : 'Please enter your details so we can contact you'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] focus:border-transparent outline-none transition-all"
                  placeholder={language === 'ar' ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                </label>
                <input 
                  required
                  dir="ltr"
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => updateFormData({ phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] focus:border-transparent outline-none transition-all text-left"
                  placeholder="05x xxx xxxx"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                </label>
                <input 
                  required
                  dir="ltr"
                  type="email" 
                  value={formData.email}
                  onChange={(e) => updateFormData({ email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] focus:border-transparent outline-none transition-all text-left"
                  placeholder="name@example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'اسم اللاعب (اختياري)' : 'Player Name (Optional)'}
                </label>
                <input 
                  type="text" 
                  value={formData.playerName || ''}
                  onChange={(e) => updateFormData({ playerName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] focus:border-transparent outline-none transition-all"
                  placeholder={language === 'ar' ? 'اسم اللاعب إذا وجد' : 'Player name if applicable'}
                />
              </div>

              <CustomSelect
                label={language === 'ar' ? 'اللعبة (اختياري)' : 'Sport (Optional)'}
                value={formData.sport || ''}
                onChange={(val) => updateFormData({ sport: val })}
                placeholder={language === 'ar' ? 'اختر الرياضة' : 'Select Sport'}
                options={[
                  { value: "Judo", label: language === 'ar' ? 'جودو' : 'Judo' },
                  { value: "Taekwondo", label: language === 'ar' ? 'تايكواندو' : 'Taekwondo' },
                  { value: "Karate", label: language === 'ar' ? 'كاراتيه' : 'Karate' },
                  { value: "JiuJitsu", label: language === 'ar' ? 'جوجيتسو' : 'Jiu-Jitsu' },
                  { value: "Wrestling", label: language === 'ar' ? 'مصارعة' : 'Wrestling' },
                  { value: "Boxing", label: language === 'ar' ? 'ملاكمة' : 'Boxing' },
                ]}
              />

              <div className="md:col-span-2">
                <CustomSelect
                  required
                  label={language === 'ar' ? 'الفرع' : 'Club Branch'}
                  value={formData.branch || ''}
                  onChange={(val) => updateFormData({ branch: val })}
                  placeholder={language === 'ar' ? 'اختر الفرع' : 'Select Branch'}
                  options={[
                    { value: "Fujairah", label: language === 'ar' ? 'الفجيرة (الرئيسي)' : 'Fujairah (Main)' },
                    { value: "Dibba", label: language === 'ar' ? 'دبا' : 'Dibba' },
                    { value: "AlBithna", label: language === 'ar' ? 'البثنة' : 'Al Bithna' },
                  ]}
                />
              </div>
            </div>

            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <button 
                type="button"
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {language === 'ar' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-[var(--color-terracotta)] hover:bg-[#b06750] transition-colors shadow-lg shadow-orange-900/20"
              >
                {language === 'ar' ? 'التالي' : 'Next'}
                {language === 'ar' ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
          </form>

        </div>
      </main>
    </>
  );
}
