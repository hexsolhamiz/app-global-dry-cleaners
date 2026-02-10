import { useMemo } from 'react';
import { format, addDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFormContext } from '@/context/FormContext';

const TIME_SLOTS = [
  '08:00 - 11:00',
  '11:00 - 14:00',
  '14:00 - 17:00',
  '17:00 - 20:00',
];

const DRIVER_INSTRUCTIONS = [
  'Collect from reception/porter',
  'Collect from me in person',
  'Collect from outside',
];

const FREQUENCIES = [
  { value: 'once', label: 'Just Once' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'two-weeks', label: 'Every Two Weeks' },
  { value: 'four-weeks', label: 'Every Four Weeks' },
];

export function CollectionDeliveryStep() {
  const { formData, updateFormData, goToNextPage, goToPrevPage } = useFormContext();

  const days = useMemo(() => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const date = addDays(new Date(), i);
      const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : format(date, 'EEE, d MMM');
      result.push({ value: format(date, 'yyyy-MM-dd'), label });
    }
    return result;
  }, []);

  const canProceed =
    formData.collectionDay &&
    formData.collectionTime &&
    formData.collectionInstruction &&
    formData.deliveryDay &&
    formData.deliveryTime &&
    formData.deliveryInstruction;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Collection and Delivery</h2>
        <p className="mt-1 text-muted-foreground">Schedule your collection and delivery</p>
      </div>

      {/* Collection Time */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Collection Time</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Select Day</label>
            <Select value={formData.collectionDay} onValueChange={(v) => updateFormData({ collectionDay: v })}>
              <SelectTrigger><SelectValue placeholder="Choose day" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {days.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Select Time</label>
            <Select value={formData.collectionTime} onValueChange={(v) => updateFormData({ collectionTime: v })}>
              <SelectTrigger><SelectValue placeholder="Choose time" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Driver Instructions</label>
            <Select value={formData.collectionInstruction} onValueChange={(v) => updateFormData({ collectionInstruction: v })}>
              <SelectTrigger><SelectValue placeholder="Choose option" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {DRIVER_INSTRUCTIONS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Delivery Time</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Select Day</label>
            <Select value={formData.deliveryDay} onValueChange={(v) => updateFormData({ deliveryDay: v })}>
              <SelectTrigger><SelectValue placeholder="Choose day" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {days.map((d) => (
                  <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Select Time</label>
            <Select value={formData.deliveryTime} onValueChange={(v) => updateFormData({ deliveryTime: v })}>
              <SelectTrigger><SelectValue placeholder="Choose time" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {TIME_SLOTS.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Driver Instructions</label>
            <Select value={formData.deliveryInstruction} onValueChange={(v) => updateFormData({ deliveryInstruction: v })}>
              <SelectTrigger><SelectValue placeholder="Choose option" /></SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {DRIVER_INSTRUCTIONS.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Driver Notes */}
      <div>
        <label className="mb-1.5 block text-sm font-medium">Additional Instructions for Driver</label>
        <Textarea
          placeholder="Any special instructions for the driver..."
          value={formData.driverNote}
          onChange={(e) => updateFormData({ driverNote: e.target.value })}
          rows={3}
        />
      </div>

      {/* Frequency */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">Frequency</label>
        <div className="flex flex-wrap gap-2">
          {FREQUENCIES.map((f) => (
            <button
              key={f.value}
              onClick={() => updateFormData({ frequency: f.value })}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                formData.frequency === f.value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={goToPrevPage} className="flex-1">
          Back
        </Button>
        <Button onClick={goToNextPage} disabled={!canProceed} className="flex-1">
          Next Step
        </Button>
      </div>
    </div>
  );
}
