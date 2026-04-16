import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type RequestType = 'inquiry' | 'complaint' | 'suggestion' | 'meeting' | 'call' | 'maintenance' | null;

interface FormData {
  type: RequestType;
  name: string;
  phone: string;
  email: string;
  playerName?: string;
  sport?: string;
  branch?: string;
  description: string;
  
  // Specific Fields
  inquiryCategories?: string[];
  
  suggestionDept?: string;
  suggestionPriority?: string;
  suggestionExpected?: string;
  
  complaintType?: string;
  againstName?: string;
  busNumber?: string;
  
  meetingPersonId?: string;
  meetingAdminName?: string;
  
  callerRole?: string;
  callSubject?: string;
  
  maintenanceTarget?: 'building' | 'bus';
  maintenanceCategories?: string[]; // AC, Elec, etc.
  maintenanceBusNo?: string;
  maintenanceUrgency?: 'periodic' | 'urgent';
}

interface RequestState {
  formData: FormData;
  attachments: File[];
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  updateFormData: (data: Partial<FormData>) => void;
  setAttachments: (files: File[]) => void;
  resetForm: () => void;
}

const initialFormData: FormData = {
  type: null,
  name: '',
  phone: '',
  email: '',
  playerName: '',
  sport: '',
  branch: '',
  description: '',
  inquiryCategories: [],
  maintenanceTarget: 'building',
  maintenanceCategories: [],
};

export const useRequestStore = create<RequestState>()(
  persist(
    (set) => ({
      formData: initialFormData,
      attachments: [],
      language: 'ar',
      setLanguage: (lang) => set({ language: lang }),
      updateFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
      setAttachments: (files) => set({ attachments: files }),
      resetForm: () => set({ formData: initialFormData, attachments: [] }),
    }),
    {
      name: 'fmac-request-storage',
      partialize: (state) => ({ formData: state.formData, language: state.language }),
    }
  )
);
