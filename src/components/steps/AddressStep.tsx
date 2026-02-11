import { useState, useEffect, useCallback } from 'react';
import { MapPin, Hotel, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useFormContext } from '@/context/FormContext';
import { autocompletePostcode, validateAndGetAddress, searchByAddress, HOTELS_NEAR_STANMORE } from '@/lib/postcodes';

export function AddressStep() {
  const { formData, updateFormData, goToNextPage } = useFormContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [addressResults, setAddressResults] = useState<Array<{ postcode: string; address: string }>>([]);
  const [hotelResults, setHotelResults] = useState(HOTELS_NEAR_STANMORE);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const isPostcodeMode = formData.searchMode === 'postcode';
  const isHotelMode = formData.searchMode === 'hotel';
  const isAddressMode = formData.searchMode === 'address';

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      queueMicrotask(() => {
        setSuggestions([]);
        setAddressResults([]);
      });
      return;
    }

    const timer = setTimeout(async () => {
      if (isPostcodeMode) {
        const results = await autocompletePostcode(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
      } else if (isAddressMode) {
        const results = await searchByAddress(searchQuery);
        setAddressResults(results);
        setShowSuggestions(true);
      } else if (isHotelMode) {
        const filtered = HOTELS_NEAR_STANMORE.filter(
          (h) => h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            h.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setHotelResults(filtered);
        setShowSuggestions(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, formData.searchMode]);

  const handleSelectPostcode = useCallback(async (postcode: string) => {
    setLoading(true);
    setError('');
    setShowSuggestions(false);
    setSearchQuery(postcode);

    const result = await validateAndGetAddress(postcode);
    setLoading(false);

    if (result.outOfRange) {
      setError('Sorry, this postcode is outside our service area (10 miles from Stanmore).');
      return;
    }
    if (!result.valid) {
      setError('Invalid postcode. Please try again.');
      return;
    }

    updateFormData({
      postcode,
      selectedAddress: result.address || '',
      addressConfirmed: false,
    });
  }, [updateFormData]);

  const handleSelectAddress = useCallback((item: { postcode: string; address: string }) => {
    setShowSuggestions(false);
    setSearchQuery(item.postcode);
    updateFormData({
      postcode: item.postcode,
      selectedAddress: item.address,
      addressConfirmed: false,
    });
  }, [updateFormData]);

  const handleSelectHotel = useCallback((hotel: { name: string; address: string }) => {
    setShowSuggestions(false);
    setSearchQuery(hotel.name);
    updateFormData({
      hotelName: hotel.name,
      selectedAddress: hotel.address,
      addressType: 'hotel',
      addressConfirmed: false,
    });
  }, [updateFormData]);

  const handleConfirm = () => {
    if (formData.addressType === 'hotel' && !formData.roomNumber) return;
    if (formData.addressType !== 'hotel' && !formData.addressDetails) return;
    updateFormData({ addressConfirmed: true });
    goToNextPage();
  };

  const switchMode = (mode: 'postcode' | 'hotel' | 'address') => {
    updateFormData({ searchMode: mode, selectedAddress: '', postcode: '', hotelName: '' });
    setSearchQuery('');
    setSuggestions([]);
    setAddressResults([]);
    setError('');
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Collection and Delivery</h2>
        <p className="mt-1 text-muted-foreground">Find your address to get started (We are only avaialable within 10 miles of Stanmore)</p>
      </div>

      {/* Search Field */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          {isHotelMode ? 'Search for your hotel' : isAddressMode ? 'Search by address' : 'Find your address (postcode)'}
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={isHotelMode ? 'Type hotel name...' : isAddressMode ? 'Type your address...' : 'Enter your postcode...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <div className="rounded-lg border border-border bg-popover shadow-lg z-50 max-h-48 overflow-y-auto">
            {isPostcodeMode && suggestions.map((s) => (
              <button
                key={s}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => handleSelectPostcode(s)}
              >
                <MapPin className="mr-2 inline h-3.5 w-3.5 text-primary" />
                {s}
              </button>
            ))}
            {isAddressMode && addressResults.map((a) => (
              <button
                key={a.postcode}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => handleSelectAddress(a)}
              >
                <MapPin className="mr-2 inline h-3.5 w-3.5 text-primary" />
                {a.address} — {a.postcode}
              </button>
            ))}
            {isHotelMode && hotelResults.map((h) => (
              <button
                key={h.name}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-accent transition-colors"
                onClick={() => handleSelectHotel(h)}
              >
                <Hotel className="mr-2 inline h-3.5 w-3.5 text-primary" />
                {h.name} — {h.address}
              </button>
            ))}
            {((isPostcodeMode && suggestions.length === 0) ||
              (isAddressMode && addressResults.length === 0) ||
              (isHotelMode && hotelResults.length === 0)) && (
              <p className="px-4 py-3 text-sm text-muted-foreground">No results found</p>
            )}
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {loading && <p className="text-sm text-muted-foreground">Validating postcode...</p>}

        {/* Mode toggles */}
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {isPostcodeMode && (
            <button
              className="text-primary hover:underline"
              onClick={() => switchMode('address')}
            >
              Don&apos;t know your postcode?
            </button>
          )}
          {isAddressMode && (
            <button
              className="text-primary hover:underline"
              onClick={() => switchMode('postcode')}
            >
              Search by postcode
            </button>
          )}
        </div>
      </div>

      {/* Hotel Box */}
      <Card className="border-primary/20 bg-primary/5 p-4">
        <div className="flex items-start gap-3">
          <Hotel className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">
              {isHotelMode
                ? 'No need to wait for our driver — leave your items at the reception'
                : 'Staying at a hotel? No need to wait for our driver — leave your items at the reception'}
            </p>
            <button
              className="mt-1 text-sm font-medium text-primary hover:underline"
              onClick={() => switchMode(isHotelMode ? 'postcode' : 'hotel')}
            >
              {isHotelMode ? 'Search by postcode' : 'Search for your hotel'}
            </button>
          </div>
        </div>
      </Card>

      {/* Address Type Selection (shows after address is selected) */}
      {formData.selectedAddress && (
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Choose address type</p>
          <div className="flex gap-2">
            {(['home', 'office', 'hotel'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateFormData({ addressType: type })}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium capitalize transition-all ${
                  formData.addressType === type
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-secondary text-secondary-foreground hover:bg-accent'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Address Details / Room Number */}
          {formData.addressType === 'hotel' ? (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Room Number</label>
              <Input
                placeholder="Enter your room number"
                value={formData.roomNumber}
                onChange={(e) => updateFormData({ roomNumber: e.target.value })}
              />
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium">Address Details</label>
              <Input
                placeholder="House number, street name, flat number..."
                value={formData.addressDetails}
                onChange={(e) => updateFormData({ addressDetails: e.target.value })}
              />
            </div>
          )}

          <div className="rounded-lg bg-accent/50 p-3 text-sm text-accent-foreground">
            <span className="font-medium">Selected:</span> {formData.selectedAddress}
            {formData.postcode && ` (${formData.postcode})`}
          </div>

          <Button onClick={handleConfirm} className="w-full" size="lg">
            Confirm Location
          </Button>
        </div>
      )}
    </div>
  );
}
