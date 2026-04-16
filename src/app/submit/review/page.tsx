"use client";

import { useRequestStore } from "@/store/requestStore";
import { Navigation } from "@/components/Navigation";
import { Stepper } from "@/components/Stepper";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { ArrowLeft, CheckCircle, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const generateTicketNumber = () => {
  const year = new Date().getFullYear();
  const randomStr = Math.floor(100000 + Math.random() * 900000);
  return `FMAC-${year}-${randomStr}`;
};

export default function ReviewForm() {
  const { language, formData, resetForm } = useRequestStore();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorStatus, setErrorStatus] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");
  const loadingRef = useRef(false);

  const updateStatus = (msgAr: string, msgEn: string) => {
    setCurrentStatus(language === 'ar' ? msgAr : msgEn);
  };

  const submitRequest = async () => {
    if (loadingRef.current) return;
    
    setIsSubmitting(true);
    loadingRef.current = true;
    setErrorStatus("");
    
    // Safety guard
    const timeoutId = setTimeout(() => {
      if (loadingRef.current) {
        setErrorStatus(language === 'ar' ? 'انتهت مهلة الطلب (20 ثانية). يرجى التحقق من اتصال الإنترنت.' : 'Request timed out (20s). Please check your internet connection.');
        setIsSubmitting(false);
        loadingRef.current = false;
      }
    }, 20000);

    try {
      updateStatus("جاري تهيئة الاتصال...", "Initializing connection...");
      
      updateStatus("جاري حفظ الطلب...", "Saving request to cloud...");
      const ticketNumber = generateTicketNumber();
      const now = new Date();
      const slaDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000);

      await addDoc(collection(db, "requests"), {
        ticketNumber,
        type: formData.type,
        status: "new",
        priority: formData.suggestionPriority || "medium",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        slaDeadline,
        userInfo: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          playerName: formData.playerName || null,
          sport: formData.sport || null,
          branch: formData.branch,
        },
        serviceDetails: {
          inquiryCategories: formData.inquiryCategories || [],
          suggestionDept: formData.suggestionDept || null,
          suggestionExpected: formData.suggestionExpected || null,
          complaintType: formData.complaintType || null,
          againstName: formData.againstName || null,
          busNumber: formData.busNumber || null,
          meetingPersonId: formData.meetingPersonId || null,
          meetingAdminName: formData.meetingAdminName || null,
          callerRole: formData.callerRole || null,
          callSubject: formData.callSubject || null,
          maintenanceTarget: formData.maintenanceTarget || null,
          maintenanceCategories: formData.maintenanceCategories || [],
          maintenanceBusNo: formData.maintenanceBusNo || null,
          maintenanceUrgency: formData.maintenanceUrgency || null,
        },
        content: {
          description: formData.description,
          attachments: [], // Removed as requested
        },
        admin: {
          assignedTo: null,
          internalNotes: [],
          responseTime: null,
        }
      });

      updateStatus("تم الإرسال بنجاح!", "Successfully submitted!");
      clearTimeout(timeoutId);
      loadingRef.current = false;
      resetForm();
      router.push(`/submit/success/${ticketNumber}`);
    } catch (error: any) {
      clearTimeout(timeoutId);
      loadingRef.current = false;
      console.error("Submission error: ", error);
      
      let msg = language === 'ar' ? 'فشل الإرسال. يرجى المحاولة لاحقاً.' : 'Submission failed. Please try again.';
      if (error.code === 'permission-denied') {
        msg = language === 'ar' ? 'خطأ في أذونات الداتابيز. يرجى مراجعة Firestore Rules.' : 'Database Permission Denied. Please check Firestore Rules.';
      }
      
      setErrorStatus(`${msg} (${error.code || 'unknown'})`);
      setIsSubmitting(false);
    }
  };

  const renderDetailItem = (labelAr: string, labelEn: string, value: any) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    return (
      <div className="border-b border-gray-50 py-3 last:border-none">
        <span className="text-gray-400 text-[10px] font-black uppercase block mb-1 tracking-widest">
          {language === 'ar' ? labelAr : labelEn}
        </span>
        <span className="text-[var(--color-espresso)] font-bold text-sm">
          {Array.isArray(value) ? value.join(', ') : value}
        </span>
      </div>
    );
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 flex flex-col items-center py-10 px-6 bg-[var(--color-bg)] min-h-screen">
        <div className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 border border-white">
          <Stepper currentStep={4} />
          
          <div className="mb-10 text-center text-[var(--color-espresso)]">
            <h2 className="text-3xl font-black tracking-tighter">
              {language === 'ar' ? 'مراجعة الطلب النهائي' : 'Final Review'}
            </h2>
          </div>

          <div className="space-y-8">
            <div className="bg-[var(--color-beige)]/30 rounded-3xl p-8 border border-white">
              <h3 className="font-black text-[var(--color-espresso)] text-xs uppercase tracking-widest mb-6">
                 {language === 'ar' ? 'معلومات التواصل' : 'Contact Profile'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                {renderDetailItem('الاسم', 'Full Name', formData.name)}
                {renderDetailItem('الهاتف', 'Phone', formData.phone)}
                {renderDetailItem('البريد', 'Email Address', formData.email)}
                {renderDetailItem('الفرع', 'Club Branch', formData.branch)}
                {renderDetailItem('اللاعب', 'Student/Player', formData.playerName)}
                {renderDetailItem('اللعبة', 'Sport Category', formData.sport)}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border-2 border-[var(--color-beige)]">
              <h3 className="font-black text-[var(--color-espresso)] text-xs uppercase tracking-widest mb-6">
                {language === 'ar' ? 'تفاصيل الخدمة' : 'Service Provisions'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
                {renderDetailItem('نوع الطلب', 'Request Type', formData.type)}
                {renderDetailItem('تصنيف الاستفسار', 'Inquiry Tags', formData.inquiryCategories)}
                {renderDetailItem('الشكوى ضد', 'Against Type', formData.complaintType)}
                {renderDetailItem('الاسم المستهدف', 'Target Name', formData.againstName)}
                {renderDetailItem('رقم الحافلة', 'Bus Number', formData.busNumber)}
              </div>
              <div className="mt-8 pt-8 border-t border-[var(--color-beige)]">
                <p className="text-[var(--color-espresso)] text-sm font-semibold leading-relaxed whitespace-pre-wrap">{formData.description}</p>
              </div>
            </div>

            {errorStatus && (
              <div className="p-6 bg-red-50 text-red-700 rounded-2xl flex flex-col items-center gap-2 border border-red-200">
                <AlertCircle className="w-5 h-5" />
                <p className="font-bold text-xs text-center">{errorStatus}</p>
              </div>
            )}

            <div className="pt-10 flex flex-col items-center gap-6">
              <button 
                onClick={submitRequest}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 py-6 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] text-white transition-all shadow-xl ${
                  isSubmitting ? 'bg-[var(--color-espresso)]' : 'bg-[var(--color-terracotta)] hover:bg-[#b06750]'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {currentStatus}
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    {language === 'ar' ? 'تأكيد وإرسال الطلب' : 'Confirm & Submit'}
                  </>
                )}
              </button>
              
              {!isSubmitting && (
                <button onClick={() => router.back()} className="font-black text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-gray-600">
                   {language === 'ar' ? 'رجوع للتعديل' : '← Back to edit'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
