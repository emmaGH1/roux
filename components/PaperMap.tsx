import type { LatLng } from "../lib/geo";

type Mark = LatLng & { kind: "person" | "roux" | "spot"; label?: string };

const BBOX = { minLng: -74.04, maxLng: -73.93, minLat: 40.66, maxLat: 40.74 };

function xy(p: LatLng) {
  const x = ((p.lng - BBOX.minLng) / (BBOX.maxLng - BBOX.minLng)) * 100;
  const y = (1 - (p.lat - BBOX.minLat) / (BBOX.maxLat - BBOX.minLat)) * 100;
  return { x: clamp(x, 4, 96), y: clamp(y, 6, 94) };
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

export function PaperMap({ marks }: { marks: Mark[] }) {
  const people = marks.filter((m) => m.kind === "person");
  const roux = marks.find((m) => m.kind === "roux");
  const spots = marks.filter((m) => m.kind === "spot");

  return (
    <svg
      id="paper-map"
      viewBox="0 0 100 72"
      role="img"
      aria-label="Paper map. Two people marked. Roux at the midpoint."
      style={{ width: "100%", height: "auto", background: "var(--paper-dark)" }}
    >
      <rect width="100" height="72" fill="var(--paper-dark)" />
      {[20, 40, 60, 80].map((x) => (
        <line key={`v${x}`} x1={x} y1="0" x2={x} y2="72" stroke="var(--ink)" strokeOpacity="0.08" />
      ))}
      {[18, 36, 54].map((y) => (
        <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="var(--ink)" strokeOpacity="0.08" />
      ))}
      <text x="4" y="8" fontFamily="var(--font-mono)" fontSize="3" fill="var(--ink-mute)">
        NY · INK
      </text>
      {people.length === 2 && (
        <line
          x1={xy(people[0]).x}
          y1={xy(people[0]).y}
          x2={xy(people[1]).x}
          y2={xy(people[1]).y}
          stroke="var(--ink)"
          strokeOpacity="0.35"
          strokeDasharray="1.2 1.2"
        />
      )}
      {spots.map((s, i) => {
        const p = xy(s);
        return <circle key={i} cx={p.x} cy={p.y} r="0.9" fill="var(--ink)" fillOpacity="0.45" />;
      })}
      {people.map((m, i) => {
        const p = xy(m);
        return <circle key={`p${i}`} cx={p.x} cy={p.y} r="1.6" fill="var(--ink)" />;
      })}
      {roux && (
        <text
          x={xy(roux).x}
          y={xy(roux).y + 1.6}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize="7"
          fill="var(--wine)"
          fontWeight="600"
        >
          R
        </text>
      )}
    </svg>
  );
}
