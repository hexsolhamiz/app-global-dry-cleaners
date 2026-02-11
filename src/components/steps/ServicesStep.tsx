import { useState } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFormContext, ServiceItem } from '@/context/FormContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

const CATALOG: Record<string, Record<string, number>> = {
  "Dry Cleaning": {
    "Blouse": 6.50, "Bow Tie": 3.00, "Cashmere Trousers": 9.00, "Coat": 13.00,
    "Dinner Suit": 20.00, "Dress": 12.00, "Evening/Delicate Jumpsuit": 16.00,
    "Handkerchief": 2.00, "Hijab": 6.00, "Jeans": 8.00, "Jumpsuit": 15.00,
    "Kurta": 12.00, "Pashmina": 8.00, "Pleated Skirt": 9.00,
    "Puffa Gilet - Dry Clean/Wash": 11.00, "Pyjamas": 10.00, "Scarf": 5.00,
    "Shorts": 5.00, "Silk Jacket": 10.00, "Ski Gloves": 13.00, "Skirt": 7.00,
    "Ski Trousers": 11.00, "Tie": 5.00, "Trousers": 8.00, "Two-Piece Suit": 13.00,
    "Bolero": 5.00, "Cashmere Knitwear": 10.00, "Dinner Jacket": 9.00,
    "Dinner Trousers": 9.00, "Evening/Delicate Dress": 25.00, "Gown": 11.00,
    "Hat": 5.00, "Jacket": 8.00, "Jumper": 8.00, "Knitwear": 7.00,
    "Ladies Top": 5.00, "Playsuit": 9.00, "Poncho": 10.00,
    "Puffa Jacket - Dry Clean/Wash": 25.00, "Sari": 18.00, "Shawl": 7.00,
    "Silk/Beads Top": 9.00, "Silk Trousers": 9.00, "Ski Jacket": 13.00,
    "Ski Suit": 25.00, "Three Piece Suit": 18.50, "Top": 5.00, "T-Shirt": 4.50,
    "Waistcoat": 7.00, "Silk Dress": 15.00, "Silk Skirt": 10.00,
    "Cashmere Jumper": 9.75, "Delicate Blouse": 9.00, "Coat Heavy": 18.50,
    "Coat Medium": 15.00, "Embellished Dress": 35.00
  },
  "House Hold": {
    "Tea Towel": 0.50, "Napkin": 1.00, "Towel": 1.50,
    "Bath Sheet (from 1.5 metre in length)": 3.00, "Table Mat": 3.00,
    "Apron - Wash & Press": 3.50, "Slippers": 3.50,
    "Tea Cosy - Wash & Press": 3.75, "Bath Mat": 4.00, "Bath Robe": 4.50,
    "Blinds per m²": 4.50, "Mat": 4.75, "Cushion Cover": 5.00,
    "Cushion - Small": 5.00, "Toy (Small)": 5.00, "Table Cloth": 6.50,
    "Cushion - Large": 7.00, "Cushion Cover - Large": 8.00, "Chair Cover": 8.50,
    "Toy (Large) Dry Clean/Wash": 8.50, "Table Runner - Wash & Press": 12.00,
    "Sofa Cover (1 Seater)": 14.00, "Throw": 14.50,
    "Rug - Dryclean / Wash per m²": 18.00, "Futon Cover": 23.00,
    "Sofa Cover (2 Seater)": 23.00, "Chair Cover - Double": 24.00,
    "Handbag - Cleaning": 28.00, "Sofa Cover (3 Seater)": 33.00
  },
  "Shirt": {
    "Shirt (On Hanger) - Press Only": 2.00, "Shirt (On Hanger) - Wash & Press": 2.70,
    "Shirt (Folded) - Press Only": 2.95, "T-Shirt - Dry Clean": 3.00,
    "Shirt (Folded) - Wash & Press": 3.25, "Ladies Shirt - Wash & Press": 3.50,
    "Shirt - Dry Cleaning": 4.00
  },
  "Bedding": {
    "Pillow Case - Wash & Press / Dry Clean": 2.10, "Pillow Case - Silk": 4.00,
    "Sheet - Single Size (Wash & Press)": 4.95, "Duvet Cover - Single (Wash & Press)": 6.00,
    "Sheet - Double (Wash & Press)": 6.50, "Sheet - Super King Size (Wash & Press)": 6.50,
    "Duvet Cover - Double (Wash & Press)": 7.00, "Sheet - King Size (Wash & Press)": 7.15,
    "Duvet Cover - King Size (Wash & Press)": 8.00,
    "Duvet Cover - Super King Size (Wash & Press)": 8.50,
    "Blanket - Small (Dry Clean)": 9.00, "Valance - Wash & Press / Dry Clean": 9.00,
    "Pillow": 10.00, "Mattress Cover - Wash & Press": 11.00,
    "Bed Footer - Wash & Press": 12.00, "Silk Duvet Cover - King": 12.00,
    "Silk Duvet Cover - Super King": 13.00, "Bed Set - Single (Wash & Press)": 14.00,
    "Mattress Protector": 14.00, "Sleeping Bag": 14.00, "Standard Bed Spread": 14.00,
    "Blanket": 15.00, "Duvet - Single": 16.00, "Small Throw": 16.00,
    "Pillow (Feather)": 16.00, "Bed Set - Double (Wash & Press)": 16.50,
    "Duvet (Feather) - Single": 18.00, "Bed Set - King (Wash & Press)": 19.00,
    "Bed Spread - Heavy": 19.00, "Blanket - King Size (Dry Clean)": 19.00,
    "Duvet - Double": 20.00, "Bed Set - Super King (Wash & Press)": 21.00,
    "Blanket (Large)": 21.00, "Duvet - King Size": 22.00, "Bed Throw": 23.00,
    "Duvet - Super King Size": 24.00, "Mattress Topper": 24.00,
    "Silk Bed Set - Double": 25.00, "Duvet (Feather) - Double": 26.00,
    "Duvet (Feather) - King Size": 28.00, "Duvet (Feather) - Super King Size": 30.00
  },
  "Curtains": {
    "Curtains - Non-Lined per m²": 4.25, "Curtains - Medium Lined per m²": 6.00,
    "Curtain Cleaning": 6.00, "Curtains - Heavy Lined per m²": 7.50
  },
  "Shoes": {
    "Shoe Repair": 5.00, "Ladies Heel Tips": 10.50, "Ladies Shoe Tips": 13.00,
    "Ladies Rubber Heels": 14.00, "Shoe Shine": 14.00, "Men's Shoe Tips": 16.50,
    "Men's Rubber Heels": 18.00, "Ladies Rubber Half Sole": 24.00,
    "Men's Rubber Half Sole": 30.00, "Ladies Rubber Half Sole & Rubber Heel": 33.00,
    "Men's Leather Half Sole": 41.00, "Men's Rubber Half Sole & Rubber Heels": 42.50,
    "Ladies Leather Sole & Leather Half Heel": 44.00, "Ladies Leather Half Sole": 45.00,
    "Boot - Zip Repair": 50.00, "Men's Leather Half Sole & Leather Heel": 64.00
  },
  "Trainers": { "Trainers Cleaning": 19.00 },
  "Alterations": {
    "Sewing Name Tags": 1.30, "Button Repair": 3.00, "Small Repair": 6.00,
    "Re-hem Trousers (1 Leg)": 6.75, "Open Button Hole": 8.45,
    "Remove Front Pocket": 8.50, "Repairs / Alterations": 11.85,
    "Top Shortening": 12.00, "Re-hem – Dress / Skirt / Coat": 12.50,
    "Patch Repair": 13.50, "Curtains Shortening (per metre*)": 14.50,
    "New Zip (0)": 15.00, "Trouser Lengthening": 15.50, "Trouser Shortening": 15.50,
    "Trouser Waist In / Waist Out": 17.20, "Skirt Shortening": 18.00,
    "Dress Shortening": 18.25, "Coat Lining Repair": 22.50,
    "Lining – Skirt": 23.50, "Sleeve Lengthening": 23.75, "Sleeve Shortening": 23.75,
    "Trouser Tapering": 27.00, "Dress Tapering": 28.00, "New Zip (10)": 29.50,
    "Jacket / Coat Shortening": 33.50, "Lining – Dress": 34.00,
    "New Zip (30)": 43.50, "Lining – Jacket": 64.00
  },
  "Leather": {
    "Leather/Fur/Suede Gloves": 15.00, "Leather Skirt": 30.00,
    "Leather/Fur/Suede Jacket": 52.00, "Item With Leather, Fur or Suede Trim": 24.00,
    "Leather Trousers": 30.00, "Leather/Fur/Suede Coat": 60.00
  },
  "Specialist": {
    "Burberry Trench Coat": 35.00, "Moncler Jacket": 40.00,
    "Canada Goose Coat": 40.00
  },
  "Ironing": {
    "Apron - Press Only": 2.50, "Blanket - Press Only": 10.00,
    "Blouse - Press Only": 3.50, "Coat - Press Only": 9.00,
    "Cumerband - Press Only": 4.00, "Cushion - Press Only": 3.00,
    "Double Duvet Cover - Press Only": 7.50, "Double Sheet - Press Only": 6.00,
    "Dress - Press Only": 7.50, "Duvet Cover - Super King Size - Press Only": 7.50,
    "Evening / Delicate Dress - Press Only": 13.50, "Gown - Press Only": 7.00,
    "Handkerchief - Press Only": 1.25, "Jacket - Press Only": 6.00,
    "Jeans - Press Only": 4.50, "Jumper - Press Only": 4.25,
    "Jumpsuit - Press Only": 8.00, "King Duvet Cover - Press Only": 7.50,
    "King Sheet - Press Only": 5.00, "Knitwear - Press Only": 2.50,
    "Kurta - Press Only": 7.50, "Ladies Top - Press Only": 2.50,
    "Large Cushion Cover - Press Only": 6.50, "Leggings - Press Only": 2.50,
    "Napkin - Press Only": 0.75, "Pashmina - Press Only": 4.00,
    "Pillowcase - Press Only": 1.75, "Polo T-Shirt - Press Only": 3.00,
    "Pyjama Bottoms - Press Only": 2.50, "Pyjama Top - Press Only": 2.50,
    "Sari - Press Only": 12.00, "Scarf - Press Only": 2.50,
    "Sheet - Super King Size - Press Only": 4.00, "Shorts - Press Only": 3.00,
    "Single Duvet Cover - Press Only": 5.50, "Single Sheet - Press Only": 5.00,
    "Skirt - Press Only": 4.00, "Table Cloth - Press Only": 4.00,
    "Table Runner - Press Only": 9.00, "Three-Piece Suit - Press Only": 11.00,
    "Tie - Press Only": 2.50, "Top - Press Only": 3.50, "Towel - Press Only": 1.50,
    "Tracksuit Bottoms - Press Only": 2.80, "Trousers - Press Only": 4.00,
    "T-Shirt - Press Only": 2.50, "Two-Piece Suit - Press Only": 9.00,
    "Valance - Press Only": 7.00, "Waistcoat - Press Only": 3.00
  },
  "Laundry": {
    "Scarf - Wash & Press": 2.70, "Polo Shirt - Wash & Press": 2.75,
    "Top - Wash & Press": 3.00, "T-Shirt - Wash & Press": 3.00,
    "Shorts - Wash & Press": 3.25, "Leggings - Wash & Press": 3.30,
    "Blouse - Wash & Press": 4.00, "Jeans - Wash & Press": 4.00,
    "Knitwear - Wash & Press": 4.00, "Waistcoat - Wash & Press": 4.20,
    "Skirt - Wash & Press": 4.50, "Jumper - Wash & Press": 4.80,
    "Pyjamas - Wash & Press": 5.25, "Jacket - Wash & Press": 5.50,
    "Robe - Wash & Press": 5.50, "Trousers - Wash & Press": 5.50,
    "Jumpsuit - Wash & Press": 8.00, "Nightdress - Wash & Press": 9.00,
    "Tracksuit - Wash & Press": 9.50, "Coat - Wash & Press": 10.00,
    "Kurta - Wash & Press": 10.00,
    "Service Wash (Wash, Dry & Fold) Up to 5 Kg": 15.00,
    "Service Wash (Wash, Dry & Fold) Up to 10 Kg": 30.00
  },
  "Offers": {
    "\"Office Offer\" 2 x Two-Piece suit dry cleaning": 23.00,
    "2 x 3 Piece Suits": 31.99,
    "School Offer (Weekly uniform sets washed & Ironed including)": 54.99,
    "10 Shirts Wash & Press": 29.00, "Sports Offer": 49.99,
    "Bride & Groom Offer": 249.99
  }
};

const CATEGORIES = Object.keys(CATALOG);

export function ServicesStep() {
  const { formData, addService, removeService, goToNextPage, goToPrevPage, totalPrice } = useFormContext();
  const [activeTab, setActiveTab] = useState(CATEGORIES[0]);

  const getQuantity = (itemId: string) =>
    formData.selectedServices.filter((s) => s.id === itemId).length;

  const handleAdd = (category: string, name: string, price: number) => {
    const id = `${category}::${name}`;
    addService({ id, name, price });
  };

  const handleRemove = (category: string, name: string) => {
    const id = `${category}::${name}`;
    // Remove one instance
    const idx = formData.selectedServices.findIndex((s) => s.id === id);
    if (idx !== -1) {
      removeService(id);
    }
  };

  const cartCount = formData.selectedServices.length;

  return (
    <div className="space-y-6">
  <div>
    <h2 className="text-2xl font-bold text-foreground">What services do you need?</h2>
    <p className="mt-1 text-muted-foreground">Browse categories and add items to your order</p>
  </div>

  <Tabs value={activeTab} onValueChange={setActiveTab}>
    {/* Responsive Tabs List - Horizontal scroll on mobile, grid on desktop */}
    <div className="relative -mx-4 sm:mx-0">
      <TabsList className="inline-flex w-max min-w-full sm:grid sm:w-auto sm:grid-cols-5 gap-1 bg-muted p-1 overflow-x-auto scrollbar-hide sm:overflow-visible px-4 sm:px-0">
        {CATEGORIES.map((cat) => (
          <TabsTrigger
            key={cat}
            value={cat}
            className="whitespace-nowrap px-4 py-2 sm:px-3 sm:py-1.5 text-sm sm:text-xs lg:text-sm flex-shrink-0 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            {cat}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* Gradient fade indicators for scroll on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none sm:hidden" />
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none sm:hidden" />
    </div>

    {CATEGORIES.map((cat) => (
      <TabsContent key={cat} value={cat} className="mt-4 sm:mt-6 md:mt-8 lg:mt-24">
        {/* Responsive grid layout for items - changes columns based on screen size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(CATALOG[cat]).map(([itemName, price]) => {
            const id = `${cat}::${itemName}`;
            const qty = getQuantity(id);

            return (
              <div
                key={itemName}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border bg-card hover:shadow-md transition-all duration-200 hover:border-primary/50 hover:bg-accent/30"
              >
                <div className="flex-1 min-w-0 w-full sm:w-auto mb-3 sm:mb-0 sm:pr-4">
                  <p className="text-sm font-medium text-foreground break-words line-clamp-2">
                    {itemName}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">
                    £{price.toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-end">
                  {qty > 0 ? (
                    <>
                      <button
                        onClick={() => handleRemove(cat, itemName)}
                        className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="min-w-[1.5rem] text-center text-sm font-semibold text-foreground">
                        {qty}
                      </span>
                      <button
                        onClick={() => handleAdd(cat, itemName, price)}
                        className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleAdd(cat, itemName, price)}
                      className="flex h-8 w-8 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm hover:shadow"
                      aria-label="Add item"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </TabsContent>
    ))}
  </Tabs>

  {/* Responsive cart summary */}
  {cartCount > 0 && (
    <div className="sticky bottom-4 sm:bottom-6 md:bottom-8 rounded-lg bg-accent/90 backdrop-blur-sm p-4 shadow-lg border border-border/50">
      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 xs:gap-4">
        <div className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">
            {cartCount} item{cartCount !== 1 ? 's' : ''}
          </span>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-primary">
          £{totalPrice.toFixed(2)}
        </span>
      </div>
    </div>
  )}

  {/* Responsive action buttons */}
  <div className="flex flex-col-reverse xs:flex-row gap-3 pt-2">
    <Button 
      variant="outline" 
      onClick={goToPrevPage} 
      className="flex-1 py-5 xs:py-2 text-base xs:text-sm"
    >
      Back
    </Button>
    <Button 
      onClick={goToNextPage} 
      disabled={cartCount === 0} 
      className="flex-1 py-5 xs:py-2 text-base xs:text-sm shadow-md hover:shadow-lg transition-all"
    >
      Next Step
    </Button>
  </div>
</div>
  );
}
