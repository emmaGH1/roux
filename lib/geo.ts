/** City-scale midpoint. Do not replace with a fancy geodesic unless tests fail. */

export type LatLng = { lat: number; lng: number };

export function midpoint(a: LatLng, b: LatLng): LatLng {
  return { lat: (a.lat + b.lat) / 2, lng: (a.lng + b.lng) / 2 };
}

export function km(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 10) / 10;
}

function rad(d: number) {
  return (d * Math.PI) / 180;
}
