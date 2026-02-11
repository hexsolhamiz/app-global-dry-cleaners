import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  washType?: 'mix' | 'separate';
}

export interface FormData {
  searchMode: 'postcode' | 'hotel' | 'address';
  postcode: string;
  selectedAddress: string;
  addressType: 'home' | 'office' | 'hotel';
  addressDetails: string;
  roomNumber: string;
  hotelName: string;
  addressConfirmed: boolean;

  collectionDay: string;
  collectionTime: string;
  collectionInstruction: string;

  deliveryDay: string;
  deliveryTime: string;
  deliveryInstruction: string;
  driverNote: string;
  frequency: string;

  selectedServices: ServiceItem[];

  contactType: 'individual' | 'company';
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  companyName: string;
  taxNumber: string;
}

interface FormContextType {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  completedSteps: Set<number>;
  completeStep: (...steps: number[]) => void;
  totalPrice: number;
  goToNextPage: () => void;
  goToPrevPage: () => void;
  addService: (service: ServiceItem) => void;
  removeService: (id: string) => void;
}

const defaultFormData: FormData = {
  searchMode: 'postcode',
  postcode: '',
  selectedAddress: '',
  addressType: 'home',
  addressDetails: '',
  roomNumber: '',
  hotelName: '',
  addressConfirmed: false,
  collectionDay: '',
  collectionTime: '',
  collectionInstruction: '',
  deliveryDay: '',
  deliveryTime: '',
  deliveryInstruction: '',
  driverNote: '',
  frequency: 'once',
  selectedServices: [],
  contactType: 'individual',
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  companyName: '',
  taxNumber: '',
};

const FormContext = createContext<FormContextType | undefined>(undefined);

// Maps: page 0→step 0, page 1→steps 1&2, page 2→step 3, page 3→step 4, page 4→step 5
const PAGE_TO_STEPS: Record<number, number[]> = {
  0: [0],
  1: [1, 2],
  2: [3],
  3: [4],
  4: [5],
};

export function FormProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [currentPage, setCurrentPage] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const completeStep = (...steps: number[]) => {
    setCompletedSteps((prev) => new Set([...prev, ...steps]));
  };

  const totalPrice = formData.selectedServices.reduce((sum, s) => sum + s.price, 0);

  const goToNextPage = () => {
    const stepsToComplete = PAGE_TO_STEPS[currentPage] || [];
    completeStep(...stepsToComplete);
    setCurrentPage((prev) => Math.min(prev + 1, 4));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const addService = (service: ServiceItem) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: [...prev.selectedServices, service],
    }));
  };

  const removeService = (id: string) => {
    setFormData((prev) => {
      const idx = prev.selectedServices.findIndex((s) => s.id === id);
      if (idx === -1) return prev;
      const updated = [...prev.selectedServices];
      updated.splice(idx, 1);
      return { ...prev, selectedServices: updated };
    });
  };

  return (
    <FormContext.Provider
      value={{
        formData,
        updateFormData,
        currentPage,
        setCurrentPage,
        completedSteps,
        completeStep,
        totalPrice,
        goToNextPage,
        goToPrevPage,
        addService,
        removeService,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
}
