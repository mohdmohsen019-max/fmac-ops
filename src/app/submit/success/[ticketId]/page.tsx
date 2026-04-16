"use client";

import { useRequestStore } from "@/store/requestStore";
import { Navigation } from "@/components/Navigation";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Copy, Home } from "lucide-react";
import { useState } from "react";

export default function SuccessPage() {
  const { language } = useRequestStore();
  const params = useParams();
  const router = useRouter();
  const ticketId = params.ticketId as string;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navigation />
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-[var(--color-bg)] h-full min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-10 border border-gray-100 text-center relative overflow-hidden">
          {/* Decorative background shape */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-green-50 to-white"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-green-50">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-[var(--color-espresso)] mb-2">
              {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'Request Submitted Successfully!'}
            </h1>
            
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              {language === 'ar' 
                ? 'لقد استلمنا طلبك وسيقوم فريق العمل بمراجعته والرد عليك في أقرب وقت.' 
                : 'We have received your request and our team will review it and get back to you shortly.'}
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8">
              <p className="text-sm text-gray-500 mb-2 font-semibold">
                {language === 'ar' ? 'رقم التذكرة المرجعي:' : 'Reference Ticket Number:'}
              </p>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl font-black tracking-wider text-[var(--color-terracotta)]" dir="ltr">
                  {ticketId}
                </span>
                <button 
                  onClick={handleCopy}
                  className="p-2 text-gray-400 hover:text-[var(--color-espresso)] hover:bg-gray-100 rounded-lg transition-colors"
                  title={language === 'ar' ? 'نسخ' : 'Copy'}
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-green-600 font-bold mt-2">
                  {language === 'ar' ? 'تم النسخ!' : 'Copied!'}
                </p>
              )}
            </div>

            <button 
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-2 w-full py-4 rounded-xl font-bold text-white bg-[var(--color-espresso)] hover:bg-black transition-colors shadow-lg"
            >
              <Home className="w-5 h-5 text-[var(--color-olive)]" />
              {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
