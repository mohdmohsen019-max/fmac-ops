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
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 h-full min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 border-2 border-black text-center relative overflow-hidden">
          {/* Decorative background shape */}
          <div className="absolute top-0 left-0 w-full h-32 bg-brand/5"></div>
          
          <div className="relative z-10">
            <div className="w-24 h-24 mx-auto bg-black rounded-[2rem] flex items-center justify-center mb-8 shadow-xl ring-8 ring-gray-50 group transition-transform hover:scale-110">
              <CheckCircle2 className="w-12 h-12 text-brand" />
            </div>
            
            <h1 className="text-4xl font-black text-black mb-4 tracking-tighter uppercase font-display">
              {language === 'ar' ? 'تم إرسال طلبك بنجاح!' : 'REQUEST SUBMITTED'}
            </h1>
            
            <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
              {language === 'ar' 
                ? 'لقد استلمنا طلبك وسيقوم فريق العمل بمراجعته والرد عليك في أقرب وقت.' 
                : 'We have received your request and our team will review it and get back to you shortly.'}
            </p>

            <div className="bg-white border-2 border-black rounded-[1.5rem] p-8 mb-10 shadow-[8px_8px_0px_rgba(0,0,0,1)]">
              <p className="text-[10px] text-gray-400 mb-3 font-black uppercase tracking-[0.2em]">
                {language === 'ar' ? 'رقم التذكرة المرجعي:' : 'REFERENCE TICKET'}
              </p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-3xl font-black tracking-widest text-brand" dir="ltr">
                  {ticketId}
                </span>
                <button 
                  onClick={handleCopy}
                  className="p-3 text-black hover:text-brand hover:bg-gray-100 rounded-xl transition-all"
                  title={language === 'ar' ? 'نسخ' : 'Copy'}
                >
                  <Copy className="w-6 h-6" />
                </button>
              </div>
              {copied && (
                <p className="text-xs text-brand font-black uppercase tracking-widest mt-4">
                  {language === 'ar' ? 'تم النسخ!' : 'COPIED TO CLIPBOARD'}
                </p>
              )}
            </div>

            <button 
              onClick={() => router.push('/')}
              className="flex items-center justify-center gap-3 w-full py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-white bg-black hover:bg-brand transition-all shadow-xl active:scale-95"
            >
              <Home className="w-4 h-4" />
              {language === 'ar' ? 'العودة للصفحة الرئيسية' : 'Return to Home'}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
