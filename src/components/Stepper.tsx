"use client";

import { useRequestStore } from "@/store/requestStore";
import { Check } from "lucide-react";

interface StepperProps {
  currentStep: number;
}

export function Stepper({ currentStep }: StepperProps) {
  const { language } = useRequestStore();
  
  const steps = [
    { id: 1, label: language === 'ar' ? 'نوع الطلب' : 'Type' },
    { id: 2, label: language === 'ar' ? 'المعلومات' : 'Info' },
    { id: 3, label: language === 'ar' ? 'التفاصيل' : 'Details' },
    { id: 4, label: language === 'ar' ? 'المراجعة' : 'Review' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 px-6 relative z-20">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-[5%] right-[5%] top-[20px] h-[4px] bg-gray-200 z-0 rounded-full"></div>
        
        {/* Active Progress Line */}
        <div 
          className="absolute left-[5%] top-[20px] h-[4px] bg-brand z-0 transition-all duration-500 rounded-full shadow-[0_0_20px_rgba(210,18,46,0.4)]"
          style={{ width: `${Math.min(((currentStep - 1) / (steps.length - 1)) * 90, 90)}%` }}
        ></div>
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
              <div 
                className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 border-4 border-white shadow-xl ${
                  isCompleted 
                    ? 'bg-brand text-white scale-110' 
                    : isCurrent 
                      ? 'bg-black text-white scale-125 ring-4 ring-brand/20' 
                      : 'bg-white text-gray-300 border-gray-100'
                }`}
              >
                {isCompleted ? <Check className="w-6 h-6 stroke-[4px]" /> : step.id}
              </div>
              <span className={`text-[10px] uppercase font-black tracking-widest transition-all duration-300 ${
                isCurrent ? 'text-black scale-110' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
