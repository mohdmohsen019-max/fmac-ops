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
    <div className="w-full max-w-3xl mx-auto mb-10 px-6">
      <div className="flex items-center justify-between relative">
        {/* Background Line */}
        <div className="absolute left-[5%] right-[5%] top-[20px] h-[3px] bg-gray-100 z-0 rounded-full"></div>
        
        {/* Active Progress Line */}
        <div 
          className="absolute left-[5%] top-[20px] h-[3px] bg-[var(--color-terracotta)] z-0 transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(201,123,99,0.3)]"
          style={{ width: `${Math.min(((currentStep - 1) / (steps.length - 1)) * 90, 90)}%` }}
        ></div>
        
        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          
          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-3">
              <div 
                className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500 border-4 border-white shadow-sm ${
                  isCompleted 
                    ? 'bg-[var(--color-terracotta)] text-white scale-110' 
                    : isCurrent 
                      ? 'bg-[var(--color-espresso)] text-white scale-125 shadow-xl shadow-orange-900/20' 
                      : 'bg-white text-gray-300 border-gray-100'
                }`}
              >
                {isCompleted ? <Check className="w-5 h-5 stroke-[4px]" /> : step.id}
              </div>
              <span className={`text-[10px] uppercase font-black tracking-widest transition-colors duration-300 ${
                isCurrent ? 'text-[var(--color-espresso)]' : 'text-gray-400'
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
