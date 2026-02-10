'use client';

import { useState } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/providers/StripeProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFormContext } from '@/context/FormContext';
import { toast } from 'sonner';

interface CheckoutFormProps {
  totalPrice: number;
  formData: ReturnType<typeof useFormContext>['formData'];
}

function CheckoutForm({ totalPrice, formData }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

async function handlePay() {
  if (!stripe || !elements) return;

  setLoading(true);

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    redirect: 'if_required', // 👈 KEY LINE
  });

  if (error) {
    console.error(error.message);
    setLoading(false);
    return;
  }

  if (paymentIntent?.status === 'succeeded') {
    const result = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        totalPrice,
        services: formData.selectedServices,
        address: formData.selectedAddress,
        collection: `${formData.collectionDay} ${formData.collectionTime}`,
        delivery: `${formData.deliveryDay} ${formData.deliveryTime}`,

      searchMode : formData.searchMode,
      postcode : formData.postcode,
      selectedAddress: formData.selectedAddress,
      addressType: formData.addressType,
      addressDetails: formData.addressDetails,
      roomNumber: formData.roomNumber,
      hotelName: formData.hotelName,
      
      // Collection Details
      collectionDay: formData.collectionDay,
      collectionTime: formData.collectionTime,
      collectionInstruction: formData.collectionInstruction,
      
      // Delivery Details
      deliveryDay: formData.deliveryDay,
      deliveryTime: formData.deliveryTime,
      deliveryInstruction: formData.deliveryInstruction,
      driverNote: formData.driverNote,
      frequency: formData.frequency,
      
      // Services
      selectedServices: formData.selectedServices,
      
      // Contact Information
      contactType: formData.contactType,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      companyName: formData.companyName,
      taxNumber: formData.taxNumber,
      }),
    });
    if(result.ok) {
      alert('Booking confirmation sent successfully.');
      window.location.reload();
    }
  } 

  setLoading(false);
}


  return (
    <>
      <PaymentElement />
      <Button onClick={handlePay} disabled={loading} className="w-full mt-4">
        Pay £{totalPrice.toFixed(2)}
      </Button>
    </>
  );
}

export function PaymentStep() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
    const { formData, totalPrice, goToPrevPage } = useFormContext();

  async function initPayment() {
    setLoading(true);

    const res = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: totalPrice }),
    });

    const data = await res.json();
    setClientSecret(data.clientSecret);
    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 space-y-4">
          <h3 className="font-semibold text-foreground">Order Summary</h3>

        {formData.selectedAddress && (
          <div className="text-sm">
            <span className="text-muted-foreground">Address:</span>{' '}
            <span className="text-foreground">{formData.selectedAddress}</span>
          </div>
        )}

        {formData.collectionDay && (
          <div className="text-sm">
            <span className="text-muted-foreground">Collection:</span>{' '}
            <span className="text-foreground">{formData.collectionDay} — {formData.collectionTime}</span>
          </div>
        )}

        {formData.deliveryDay && (
          <div className="text-sm">
            <span className="text-muted-foreground">Delivery:</span>{' '}
            <span className="text-foreground">{formData.deliveryDay} — {formData.deliveryTime}</span>
          </div>
        )}

        <div className="border-t border-border pt-3 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">Services</p>
          {formData.selectedServices.map((service, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-foreground">{service.name}</span>
              <span className="font-medium text-foreground">£{service.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3 flex justify-between">
          <span className="text-lg font-semibold text-foreground">Total</span>
          <span className="text-xl font-bold text-primary">£{totalPrice.toFixed(2)}</span>
        </div>
        {!clientSecret ? (
          <Button onClick={initPayment} disabled={loading} className="w-full">
            Continue to Payment
          </Button>
        ) : (
          <Elements
            stripe={stripePromise}
            options={{ clientSecret }}
          >
            <CheckoutForm totalPrice={totalPrice} formData={formData} />
          </Elements>
        )}
      </Card>

      <Button variant="outline" onClick={goToPrevPage}>
        Back
      </Button>
    </div>
  );
}
