"use client"
import { FormProvider, useFormContext } from '@/context/FormContext';
import { StepIndicator } from '@/components/StepIndicator';
import { AddressStep } from '@/components/steps/AddressStep';
import { CollectionDeliveryStep } from '@/components/steps/CollectionDeliveryStep';
import { ServicesStep } from '@/components/steps/ServicesStep';
import { ContactStep } from '@/components/steps/ContactStep';
import { PaymentStep } from '@/components/steps/PaymentStep';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

function FormContent() {
  const { currentPage } = useFormContext();

  const pages = [
    <AddressStep key="address" />,
    <CollectionDeliveryStep key="collection" />,
    <ServicesStep key="services" />,
    <ContactStep key="contact" />,
    <PaymentStep key="payment" />,
  ];

  const navItems = [
    { label: 'Home', href: 'https://globaldrycleaners.co.uk/' },
    { label: 'How It Works', href: 'https://globaldrycleaners.co.uk/how-it-works/' },
    { label: 'Order', href: '/' },
    { label: 'Service', href: 'https://globaldrycleaners.co.uk/service/' },
    { label: 'Pricing', href: 'https://globaldrycleaners.co.uk/pricing/' },
    { label: 'About', href: 'https://globaldrycleaners.co.uk/about/' },
    { label: 'Contact', href: 'https://globaldrycleaners.co.uk/contact/' },
  ]
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto  bg-background">

      {/* Header */}
      <header className=" border-border bg-card">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="https://globaldrycleaners.co.uk/" className="flex-shrink-0">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={88}
                height={48}
                className="object-contain h-12 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => (
                <div key={item.href} className="flex items-center">
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                  {index < navItems.length - 1 && (
                    <span className="text-muted-foreground mx-1">|</span>
                  )}
                </div>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 text-sm font-medium text-foreground hover:bg-muted rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>
          )}
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