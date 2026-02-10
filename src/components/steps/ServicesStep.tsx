import { useState } from 'react';
import { Plus, Minus, Droplets, Shirt, Sparkles, Wrench } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFormContext } from '@/context/FormContext';
import { WashModal } from '@/components/WashModal';

interface ServiceDef {
  id: string;
  name: string;
  price: number;
  priceLabel: string;
  badges: string[];
  icon: React.ComponentType<{ className?: string }>;
  hasModal?: boolean;
}

const SERVICES: ServiceDef[] = [
  {
    id: 'wash',
    name: 'Wash',
    price: 18.99,
    priceLabel: 'from £18.99/bag',
    badges: ['Wash', 'Tumble-dry', 'In a bag'],
    icon: Droplets,
    hasModal: true,
  },
  {
    id: 'wash-iron',
    name: 'Wash & Iron',
    price: 2.50,
    priceLabel: 'from £2.50/item',
    badges: ['Wash', 'Tumble-dry', 'Ironing', 'On hangers'],
    icon: Shirt,
  },
  {
    id: 'dry-cleaning',
    name: 'Dry Cleaning',
    price: 6.99,
    priceLabel: 'from £6.99/item',
    badges: ['Dry cleaning', 'Ironing', 'On hangers'],
    icon: Sparkles,
  },
  {
    id: 'ironing',
    name: 'Ironing Only',
    price: 2.00,
    priceLabel: 'from £2.00/item',
    badges: ['Ironing', 'On hangers'],
    icon: Shirt,
  },
  {
    id: 'duvets',
    name: 'Duvets & Bulky Items',
    price: 15.99,
    priceLabel: 'from £15.99/item',
    badges: ['Custom cleaning'],
    icon: Droplets,
  },
  {
    id: 'repairs',
    name: 'Repairs',
    price: 5.99,
    priceLabel: 'from £5.99/item',
    badges: ['Buttons and zippers'],
    icon: Wrench,
  },
];

export function ServicesStep() {
  const { formData, addService, removeService, goToNextPage, goToPrevPage, totalPrice } = useFormContext();
  const [washModalOpen, setWashModalOpen] = useState(false);

  const isAdded = (id: string) => formData.selectedServices.some((s) => s.id === id);

  const handleAdd = (service: ServiceDef) => {
    if (service.hasModal) {
      setWashModalOpen(true);
      return;
    }
    addService({ id: service.id, name: service.name, price: service.price });
  };

  const handleRemove = (id: string) => {
    removeService(id);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">What services do you need?</h2>
        <p className="mt-1 text-muted-foreground">Select the services you require</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {SERVICES.map((service) => {
          const added = isAdded(service.id);
          const Icon = service.icon;

          return (
            <Card
              key={service.id}
              className={`relative overflow-hidden p-5 transition-all ${
                added ? 'border-primary/50 bg-primary/5 shadow-md' : 'hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{service.name}</h4>
                    <p className="text-sm font-medium text-primary">{service.priceLabel}</p>
                  </div>
                </div>
                <button
                  onClick={() => (added ? handleRemove(service.id) : handleAdd(service))}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    added
                      ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {added ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {service.badges.map((badge) => (
                  <Badge key={badge} variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {formData.selectedServices.length > 0 && (
        <div className="rounded-lg bg-accent/50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Total</span>
            <span className="text-xl font-bold text-primary">£{totalPrice.toFixed(2)}</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={goToPrevPage} className="flex-1">Back</Button>
        <Button onClick={goToNextPage} disabled={formData.selectedServices.length === 0} className="flex-1">
          Next Step
        </Button>
      </div>

      <WashModal
        open={washModalOpen}
        onClose={() => setWashModalOpen(false)}
        onAdd={(washType, price) => {
          addService({ id: 'wash', name: `Wash (${washType})`, price, washType });
        }}
      />
    </div>
  );
}
