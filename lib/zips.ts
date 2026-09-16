import zips from "../fixtures/nyc-zips.json";

export type ZipRow = { name: string; lat: number; lng: number };

export function lookupZip(raw: string): ZipRow | null {
  const zip = raw.replace(/\D/g, "").slice(0, 5);
  if (zip.length === 5 && zip in zips) {
    return (zips as Record<string, ZipRow>)[zip];
  }
  const lower = raw.trim().toLowerCase();
  for (const [code, row] of Object.entries(zips as Record<string, ZipRow>)) {
    if (row.name.toLowerCase().includes(lower) && lower.length > 3) {
      return { ...row, name: `${row.name} ${code}` };
    }
  }
  return null;
}

export const PRESETS = [
  { zip: "11211", label: "Williamsburg 11211" },
  { zip: "11215", label: "Park Slope 11215" },
  { zip: "11222", label: "Greenpoint 11222" },
  { zip: "10003", label: "East Village 10003" },
  { zip: "11201", label: "DUMBO 11201" },
] as const;
