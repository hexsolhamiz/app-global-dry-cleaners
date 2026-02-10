import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface WashModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (washType: 'mix' | 'separate', price: number) => void;
}

const WASH_OPTIONS = [
  { type: 'mix' as const, label: 'Mix Wash', price: 18.99, description: 'All items washed together in one load' },
  { type: 'separate' as const, label: 'Separate Wash', price: 24.99, description: 'Lights and darks washed separately' },
];

export function WashModal({ open, onClose, onAdd }: WashModalProps) {
  const [selected, setSelected] = useState<'mix' | 'separate'>('mix');

  const selectedOption = WASH_OPTIONS.find((o) => o.type === selected)!;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Wash Type</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {WASH_OPTIONS.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelected(option.type)}
              className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                selected === option.type
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">{option.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{option.description}</p>
                </div>
                <span className="text-lg font-bold text-primary">£{option.price.toFixed(2)}</span>
              </div>
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => { onAdd(selected, selectedOption.price); onClose(); }}>
            Add Service
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
