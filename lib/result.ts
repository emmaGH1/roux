/**
 * Fair point + nearest ranking (build-revise ADR 0002).
 * Arithmetic centroid, haversine distance, prefer non-clubs.
 */

import type { DiscoveryLocation } from "./discovery";

export type Point = { lat: number; lng: number };

export function fairPoint(points: Point[]): Point {
  const lat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const lng = points.reduce((s, p) => s + p.lng, 0) / points.length;
  return { lat, lng };
}

export function km(a: Point, b: Point): number {
  const R = 6371;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)) * 10) / 10;
}

function rad(d: number): number {
  return (d * Math.PI) / 180;
}

export function rankLocations(
  mid: Point,
  locations: DiscoveryLocation[]
): DiscoveryLocation[] {
  return [...locations].sort((a, b) => {
    if (a.is_club !== b.is_club) return a.is_club ? 1 : -1;
    return km(mid, a.coordinate) - km(mid, b.coordinate);
  });
}

export function directionsUrl(p: Point): string {
  return `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lng}`;
}
