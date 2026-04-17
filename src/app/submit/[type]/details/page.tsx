"use client";

import { useRequestStore, RequestType } from "@/store/requestStore";
import { Navigation } from "@/components/Navigation";
import { Stepper } from "@/components/Stepper";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { CustomSelect } from "@/components/CustomSelect";

export default function DetailsForm() {
  const { language, formData, updateFormData } = useRequestStore();
  const router = useRouter();
  const params = useParams();
  const type = params.type as RequestType;

  useEffect(() => {
    if (!type) router.push('/');
  }, [type, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/submit/review");
  };

  const toggleCategory = (cat: string) => {
    const current = formData.inquiryCategories || [];
    const updated = current.includes(cat) 
      ? current.filter(c => c !== cat) 
      : [...current, cat];
    updateFormData({ inquiryCategories: updated });
  };

  const toggleMaintCategory = (cat: string) => {
    const current = formData.maintenanceCategories || [];
    const updated = current.includes(cat) 
      ? current.filter(c => c !== cat) 
      : [...current, cat];
    updateFormData({ maintenanceCategories: updated });
  };

  const renderServiceSpecificFields = () => {
    switch (type) {
      case 'inquiry':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">
              {language === 'ar' ? 'نوع الاستفسار' : 'Inquiry Category'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'new', ar: 'تسجيل جديد', en: 'New Registration' },
                { id: 'medical', ar: 'الفحص الطبي', en: 'Medical Exam' },
                { id: 'fitness', ar: 'الفحص البدني', en: 'Fitness Exam' },
                { id: 'schedule', ar: 'مواعيد التدريب', en: 'Training Schedule' },
                { id: 'tournaments', ar: 'البطولات', en: 'Tournaments' },
                { id: 'gear', ar: 'التجهيزات', en: 'Gear/Uniforms' },
                { id: 'clinic', ar: 'العيادة', en: 'Clinic' },
                { id: 'buses', ar: 'الحافلات', en: 'Buses' },
                { id: 'other', ar: 'أخرى', en: 'Other' },
              ].map(cat => (
                <label key={cat.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={formData.inquiryCategories?.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="w-5 h-5 accent-[var(--color-terracotta)]"
                  />
                  <span className="text-sm font-semibold">{language === 'ar' ? cat.ar : cat.en}</span>
                </label>
              ))}
            </div>
          </div>
        );
      case 'complaint':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                {language === 'ar' ? 'نوع الشكوى' : 'Complaint Type'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'bus', ar: 'شكوى على الحافلات', en: 'Bus Complaint' },
                  { id: 'coach', ar: 'شكوى على مدرب', en: 'Coach Complaint' },
                  { id: 'admin', ar: 'شكوى على إداري', en: 'Admin Complaint' },
                  { id: 'player', ar: 'شكوى على لاعب زميل', en: 'Player Complaint' },
                  { id: 'driver', ar: 'شكوى على سائق', en: 'Driver Complaint' },
                  { id: 'other', ar: 'أخرى', en: 'Other' },
                ].map(cType => (
                  <label key={cType.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <input 
                      type="radio" 
                      name="complaintType"
                      checked={formData.complaintType === cType.id}
                      onChange={() => updateFormData({ complaintType: cType.id })}
                      className="w-5 h-5 accent-[var(--color-terracotta)]"
                    />
                    <span className="text-sm font-semibold">{language === 'ar' ? cType.ar : cType.en}</span>
                  </label>
                ))}
              </div>
            </div>
            {formData.complaintType && formData.complaintType !== 'other' && formData.complaintType !== 'bus' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'الاسم المعني' : 'Name of Person'}
                </label>
                <input 
                  type="text"
                  value={formData.againstName || ''}
                  onChange={(e) => updateFormData({ againstName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] outline-none transition-all"
                />
              </div>
            )}
            {formData.complaintType === 'bus' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'رقم الحافلة' : 'Bus Number'}
                </label>
                <input 
                  type="text"
                  value={formData.busNumber || ''}
                  onChange={(e) => updateFormData({ busNumber: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] outline-none transition-all"
                />
              </div>
        );
      case 'suggestion':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomSelect
                label={language === 'ar' ? 'القسم المعني' : 'Concerned Department'}
                value={formData.suggestionDept || ''}
                onChange={(val) => updateFormData({ suggestionDept: val })}
                placeholder={language === 'ar' ? 'اختر القسم' : 'Select Department'}
                options={[
                  { value: "manager_office", label: language === 'ar' ? 'مكتب المدير' : "Manager's Office" },
                  { value: "operations", label: language === 'ar' ? 'قسم العمليات' : 'Operations Department' },
                  { value: "technical", label: language === 'ar' ? 'قسم الإعداد الفني' : 'Technical Department' },
                  { value: "finance", label: language === 'ar' ? 'القسم المالي' : 'Finance Department' },
                  { value: "support", label: language === 'ar' ? 'قسم الخدمات المساندة' : 'Support Services Department' }
                ]}
              />
              <CustomSelect
                label={language === 'ar' ? 'الأولوية' : 'Priority'}
                value={formData.suggestionPriority || 'medium'}
                onChange={(val) => updateFormData({ suggestionPriority: val })}
                options={[
                  { value: "low", label: language === 'ar' ? 'منخفضة' : 'Low' },
                  { value: "medium", label: language === 'ar' ? 'متوسطة' : 'Medium' },
                  { value: "high", label: language === 'ar' ? 'عالية' : 'High' }
                ]}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                {language === 'ar' ? 'النتيجة المتوقعة' : 'Expected Result'}
              </label>
              <textarea 
                rows={2}
                value={formData.suggestionExpected || ''}
                onChange={(e) => updateFormData({ suggestionExpected: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] resize-none transition-all outline-none"
              />
            </div>
          </div>
        );
      case 'meeting':
        return (
          <div className="space-y-6">
            <CustomSelect
              label={language === 'ar' ? 'المسؤول المطلوب مقابلته' : 'Official to meet'}
              value={formData.meetingPersonId || ''}
              onChange={(val) => updateFormData({ meetingPersonId: val })}
              placeholder={language === 'ar' ? 'اختر المسؤول' : 'Select Official'}
              options={[
                { value: "manager", label: language === 'ar' ? 'مدير النادي' : 'Club Manager' },
                { value: "ops_head", label: language === 'ar' ? 'رئيس قسم العمليات' : 'Head of Operations Department' },
                { value: "tech_head", label: language === 'ar' ? 'رئيس قسم الإعداد الفني' : 'Head of Technical Department' },
                { value: "finance_head", label: language === 'ar' ? 'رئيس القسم المالي' : 'Head of Finance Department' },
                { value: "support_head", label: language === 'ar' ? 'رئيس قسم الخدمات المساندة' : 'Head of Support Services Department' },
                { value: "specific", label: language === 'ar' ? 'موظف محدد' : 'Specific Employee' }
              ]}
            />
            {formData.meetingPersonId === 'specific' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'اسم الإداري' : 'Admin Name'}
                </label>
                <input 
                  type="text"
                  value={formData.meetingAdminName || ''}
                  onChange={(e) => updateFormData({ meetingAdminName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)]"
                />
              </div>
            )}
          </div>
        );
      case 'maintenance':
        return (
          <div className="space-y-6">
            <div className="flex p-1 bg-yellow-50 border border-yellow-200 rounded-2xl">
              <button
                type="button"
                onClick={() => updateFormData({ maintenanceTarget: 'building' })}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  formData.maintenanceTarget === 'building' ? 'bg-white shadow-md' : 'text-gray-500'
                }`}
              >
                {language === 'ar' ? 'مبنى' : 'Building'}
              </button>
              <button
                type="button"
                onClick={() => updateFormData({ maintenanceTarget: 'bus' })}
                className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                  formData.maintenanceTarget === 'bus' ? 'bg-white shadow-md' : 'text-gray-500'
                }`}
              >
                {language === 'ar' ? 'حافلة' : 'Bus'}
              </button>
            </div>
            {formData.maintenanceTarget === 'building' ? (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'نوع العطل' : 'Issue Type'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['AC', 'Electric', 'Plumbing', 'Paint', 'Other'].map(cat => (
                    <label key={cat} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <input 
                        type="checkbox" 
                        checked={formData.maintenanceCategories?.includes(cat)}
                        onChange={() => toggleMaintCategory(cat)}
                        className="accent-[var(--color-terracotta)]"
                      />
                      <span className="text-sm font-semibold">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">
                  {language === 'ar' ? 'رقم الحافلة' : 'Bus No'}
                </label>
                <input 
                  type="text"
                  value={formData.maintenanceBusNo || ''}
                  onChange={(e) => updateFormData({ maintenanceBusNo: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200"
                />
              </div>
            )}
          </div>
        );
      case 'call':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-700">
              {language === 'ar' ? 'موضوع الاتصال' : 'Call Subject'}
            </label>
            <input 
              type="text"
              value={formData.callSubject || ''}
              onChange={(e) => updateFormData({ callSubject: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)]"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 flex flex-col items-center py-10 px-6 bg-[var(--color-bg)] h-full min-h-screen">
        <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <Stepper currentStep={3} />
          <div className="mb-8 text-center text-[var(--color-espresso)]">
            <h2 className="text-2xl font-bold capitalize">
              {language === 'ar' ? 'تفاصيل الطلب' : 'Request Details'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
               {renderServiceSpecificFields()}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">
                {language === 'ar' ? 'الوصف / ملاحظات إضافية *' : 'Description / Additional Notes *'}
              </label>
              <textarea 
                required
                rows={5}
                value={formData.description}
                onChange={(e) => updateFormData({ description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[var(--color-terracotta)] outline-none transition-all resize-none shadow-sm"
              />
            </div>
            <div className="pt-6 flex items-center justify-between border-t border-gray-100">
              <button 
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                {language === 'ar' ? 'رجوع' : 'Back'}
              </button>
              <button 
                type="submit"
                className="px-10 py-4 rounded-2xl font-bold text-white bg-[var(--color-espresso)] hover:bg-black transition-all shadow-xl shadow-gray-900/10"
              >
                {language === 'ar' ? 'متابعة للمراجعة' : 'Continue to Review'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
