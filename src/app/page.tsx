"use client"
import { FormProvider, useFormContext } from '@/context/FormContext';
import { StepIndicator } from '@/components/StepIndicator';
import { AddressStep } from '@/components/steps/AddressStep';
import { CollectionDeliveryStep } from '@/components/steps/CollectionDeliveryStep';
import { ServicesStep } from '@/components/steps/ServicesStep';
import { ContactStep } from '@/components/steps/ContactStep';
import { PaymentStep } from '@/components/steps/PaymentStep';
import Image from 'next/image';

function FormContent() {
  const { currentPage } = useFormContext();

  const pages = [
    <AddressStep key="address" />,
    <CollectionDeliveryStep key="collection" />,
    <ServicesStep key="services" />,
    <ContactStep key="contact" />,
    <PaymentStep key="payment" />,
  ];

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto  bg-background">
      {/* Header */}
      <header className="border-b px-4 lg:px-6 border-border bg-card py-4">
        <div className="container mx-auto px-4">
          <Image src="/logo.webp" alt="Logo" width={88} height={48} className="object-contain h-12 w-22" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Form */}
          <div className="flex-1">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
              {pages[currentPage]}
            </div>
          </div>

          {/* Step Indicator */}
          <div className="w-full lg:w-72">
            <div className="sticky top-8">
              <StepIndicator />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const Page = () => (
  <FormProvider>
    <FormContent />
  </FormProvider>
);

export default Page;