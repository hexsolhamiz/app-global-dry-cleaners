import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFormContext } from '@/context/FormContext';

export function ContactStep() {
  const { formData, updateFormData, goToNextPage, goToPrevPage } = useFormContext();
  const isCompany = formData.contactType === 'company';

  const canProceed =
    formData.firstName &&
    formData.lastName &&
    formData.phone &&
    formData.email &&
    (!isCompany || (formData.companyName && formData.taxNumber));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">How can we contact you?</h2>
        <p className="mt-1 text-muted-foreground">Enter your contact details</p>
      </div>

      {/* Individual / Company tabs */}
      <div className="flex gap-2">
        {(['individual', 'company'] as const).map((type) => (
          <button
            key={type}
            onClick={() => updateFormData({ contactType: type })}
            className={`rounded-lg px-5 py-2.5 text-sm font-medium capitalize transition-all ${
              formData.contactType === type
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-medium">First Name</label>
          <Input
            placeholder="John"
            value={formData.firstName}
            onChange={(e) => updateFormData({ firstName: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Last Name</label>
          <Input
            placeholder="Doe"
            value={formData.lastName}
            onChange={(e) => updateFormData({ lastName: e.target.value })}
          />
        </div>

        {isCompany && (
          <>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Company Name</label>
              <Input
                placeholder="Company Ltd"
                value={formData.companyName}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Tax Number</label>
              <Input
                placeholder="GB123456789"
                value={formData.taxNumber}
                onChange={(e) => updateFormData({ taxNumber: e.target.value })}
              />
            </div>
          </>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium">Phone Number</label>
          <Input
            placeholder="+44 7XXX XXXXXX"
            value={formData.phone}
            onChange={(e) => updateFormData({ phone: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={goToPrevPage} className="flex-1">Back</Button>
        <Button onClick={goToNextPage} disabled={!canProceed} className="flex-1">
          Next Step
        </Button>
      </div>
    </div>
  );
}
