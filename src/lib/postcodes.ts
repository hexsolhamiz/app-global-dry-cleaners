const STANMORE_LAT = 51.6167;
const STANMORE_LNG = -0.3167;
const MAX_DISTANCE_MILES = 10;

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function autocompletePostcode(query: string): Promise<string[]> {
  if (query.length < 2) return [];
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(query)}/autocomplete`
    );
    const data = await res.json();
    return data.result || [];
  } catch {
    return [];
  }
}

export async function validateAndGetAddress(
  postcode: string
): Promise<{ valid: boolean; address?: string; outOfRange?: boolean }> {
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
    );
    const data = await res.json();
    if (data.status !== 200 || !data.result) return { valid: false };

    const { latitude, longitude, admin_ward, admin_district } = data.result;
    const distance = haversineDistance(STANMORE_LAT, STANMORE_LNG, latitude, longitude);

    if (distance > MAX_DISTANCE_MILES) {
      return { valid: false, outOfRange: true };
    }

    const address = [admin_ward, admin_district].filter(Boolean).join(', ');
    return { valid: true, address };
  } catch {
    return { valid: false };
  }
}

export async function searchByAddress(
  query: string
): Promise<Array<{ postcode: string; address: string }>> {
  if (query.length < 3) return [];
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes?q=${encodeURIComponent(query)}&limit=5`
    );
    const data = await res.json();
    if (!data.result) return [];

    return data.result
      .filter((r: any) => {
        const d = haversineDistance(STANMORE_LAT, STANMORE_LNG, r.latitude, r.longitude);
        return d <= MAX_DISTANCE_MILES;
      })
      .map((r: any) => ({
        postcode: r.postcode,
        address: [r.admin_ward, r.admin_district].filter(Boolean).join(', '),
      }));
  } catch {
    return [];
  }
}

export const HOTELS_NEAR_STANMORE = [
  { name: 'Premier Inn London Stanmore', address: 'London Rd, Stanmore HA7 4EB' },
  { name: 'Best Western Cumberland Hotel', address: 'St Johns Rd, Harrow HA1 2EF' },
  { name: 'Holiday Inn Harrow', address: '138 Christchurch Ave, Harrow HA3 5BD' },
  { name: 'Hindes Hotel', address: '21 Hindes Rd, Harrow HA1 1SJ' },
  { name: 'The Old Millhouse Hotel', address: 'Mill Hill, London NW7 1RB' },
  { name: 'Grim\'s Dyke Hotel', address: 'Old Redding, Harrow Weald HA3 6SH' },
];
