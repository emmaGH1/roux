"use client";

import { useEffect, useRef, useState } from "react";
import type { Map as MapboxMap } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export type MapMarker = {
  lat: number;
  lng: number;
  kind: "person" | "pick" | "backup";
  label?: string;
};

type MapViewProps = {
  markers: MapMarker[];
  /** fit bounds to these, with padding */
  zoomPadding?: number;
  height?: number;
  showCoordsChip?: boolean;
  /** full deciding sequence: radar sweep, pick lands last with a bounce */
  cinematic?: boolean;
  /** radar expands from here (defaults to the centroid of people dots) */
  sweepCenter?: { lat: number; lng: number };
  /** drop the own frame — the parent bezel owns the shape */
  bare?: boolean;
  className?: string;
};

const VIOLET = "#7c6cf6";
const REDUCED = "(prefers-reduced-motion: reduce)";

/** Static Images API pin colors (hex without the hash). */
const PIN: Record<MapMarker["kind"], string> = {
  person: "0c0c10",
  pick: "7c6cf6",
  backup: "c7c0f9",
};

type Mode = "webgl" | "static" | "diagram";

function valid(m: MapMarker) {
  return Number.isFinite(m.lat) && Number.isFinite(m.lng);
}

/** Real map, no WebGL: Mapbox Static Images API returns a plain image. */
function staticMapUrl(
  token: string,
  markers: MapMarker[],
  height: number
): string {
  const pins = markers
    .filter(valid)
    .map((m) => `pin-s+${PIN[m.kind]}(${m.lng},${m.lat})`)
    .join(",");
  const w = 1200;
  const h = Math.min(1280, Math.max(420, Math.round(height * 1.5)));
  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/${pins}/auto/${w}x${h}?padding=70&access_token=${token}`;
}

function webgl2Available(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      typeof window.WebGL2RenderingContext !== "undefined" &&
        canvas.getContext("webgl2")
    );
  } catch {
    return false;
  }
}

/**
 * The map is decoration, never the point — but "Map unavailable" is an ugly
 * way to decorate. Three tiers:
 *   1. WebGL map (full cinematic treatment)
 *   2. Static Images API — a real map on machines with WebGL off
 *   3. A drawn diagram with the true coordinates, so the layout still reads
 */
export function MapView({
  markers,
  zoomPadding = 60,
  height = 360,
  showCoordsChip = false,
  cinematic = false,
  sweepCenter,
  bare = false,
  className = "",
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const [mode, setMode] = useState<Mode>("webgl");
  const [staticBroken, setStaticBroken] = useState(false);

  const fits = markers.filter(valid);
  const cx = fits.length ? fits.reduce((s, m) => s + m.lng, 0) / fits.length : 0;
  const cy = fits.length ? fits.reduce((s, m) => s + m.lat, 0) / fits.length : 0;
  const pick = markers.find((m) => m.kind === "pick");

  /* Map identity: rebuild only when the points themselves change, not when a
     parent re-renders (a stage tick must not restart the choreography). */
  const markerKey = markers
    .map((m) => `${m.kind}:${m.lat.toFixed(5)},${m.lng.toFixed(5)}`)
    .join("|");
  const sweepKey = sweepCenter
    ? `${sweepCenter.lat.toFixed(5)},${sweepCenter.lng.toFixed(5)}`
    : "";

  useEffect(() => {
    if (!token) {
      setMode("diagram");
      return;
    }
    if (!webgl2Available()) {
      setMode("static");
      return;
    }
    if (mode !== "webgl" || !containerRef.current) return;

    /* Anything that goes wrong in here downgrades a tier instead of throwing
       into React, which would take the whole page down. mapbox-gl is loaded
       on demand so its weight never blocks first paint. */
    let cancelled = false;
    let map: MapboxMap | undefined;
    let raf = 0;
    let loaded = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const reduced =
      typeof window !== "undefined" && window.matchMedia(REDUCED).matches;

    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (cancelled || !containerRef.current) return;

        if (fits.length === 0) return;

        map = new mapboxgl.Map({
          accessToken: token,
          container: containerRef.current,
          style: "mapbox://styles/mapbox/standard",
          center: [cx, cy],
          zoom: reduced ? 13 : 9.4,
          attributionControl: false,
          interactive: false,
        });
        map.addControl(
          new mapboxgl.AttributionControl({ compact: true }),
          "bottom-right"
        );

        map.on("error", (e) => {
          console.error("Mapbox error", e.error);
        });

        map.on("load", () => {
          if (cancelled || !map) return;
          loaded = true;
          try {
            map.setConfigProperty("basemap", "lightPreset", "day");
            map.setConfigProperty("basemap", "showPointOfInterestLabels", false);
            map.setConfigProperty("basemap", "showTransitLabels", false);
          } catch {
            /* older styles without config — fine */
          }

          /* Camera: ease into the group instead of snapping. */
          const bounds = new mapboxgl.LngLatBounds();
          for (const m of fits) bounds.extend([m.lng, m.lat]);
          map.fitBounds(bounds, {
            padding: zoomPadding,
            maxZoom: 14,
            duration: reduced ? 0 : cinematic ? 1600 : 900,
          });

          /* Marker choreography. All elements mount immediately; CSS delays
             stage the appearances so nothing fights the camera. */
          const persons = fits.filter((m) => m.kind === "person");
          const backups = fits.filter((m) => m.kind === "backup");

          const personDelay = (i: number) =>
            reduced ? 0 : cinematic ? 350 + i * 160 : 150 + i * 110;
          const backupDelay = (i: number) =>
            reduced
              ? 0
              : cinematic
                ? 3000 + i * 140
                : 250 + persons.length * 110 + i * 110;
          const pickDelay = reduced ? 0 : cinematic ? 2700 : 350 + persons.length * 110;

          for (const m of fits) {
            const el = document.createElement("div");
            el.style.cssText = "position:relative;width:0;height:0;";

            const dot = document.createElement("div");
            let delay = 0;
            let name = "marker-drop";
            let dur = 420;

            if (m.kind === "pick") {
              delay = pickDelay;
              name = "pick-drop";
              dur = 620;
              dot.style.cssText = `position:absolute;width:18px;height:18px;border-radius:50%;background:${VIOLET};border:3px solid #fff;box-shadow:0 0 0 2px rgba(124,108,246,.4),0 4px 12px rgba(124,108,246,.5);left:-9px;top:-9px;`;
              const ring = document.createElement("div");
              ring.style.cssText = `position:absolute;width:18px;height:18px;border-radius:50%;border:2px solid ${VIOLET};left:-9px;top:-9px;opacity:0;`;
              ring.style.animation = `map-pulse 2s ease-out ${delay + 500}ms 3 both`;
              el.appendChild(ring);
            } else if (m.kind === "backup") {
              delay = backupDelay(backups.indexOf(m));
              dot.style.cssText = `position:absolute;width:12px;height:12px;border-radius:50%;background:#c7c0f9;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.15);left:-6px;top:-6px;`;
            } else {
              delay = personDelay(persons.indexOf(m));
              dot.style.cssText = `position:absolute;width:14px;height:14px;border-radius:50%;background:#0c0c10;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);left:-7px;top:-7px;`;
            }

            dot.style.animation = `${name} ${dur}ms cubic-bezier(.2,.9,.3,1.25) ${delay}ms both`;
            el.appendChild(dot);

            if (m.label) {
              const lbl = document.createElement("div");
              lbl.textContent = m.label;
              lbl.style.cssText = `position:absolute;left:14px;top:-9px;font:600 11px var(--font-sans);color:#0c0c10;background:rgba(255,255,255,.96);padding:3px 9px;border-radius:999px;box-shadow:0 1px 4px rgba(0,0,0,.14);white-space:nowrap;opacity:0;`;
              lbl.style.animation = `marker-fade 300ms ease-out ${delay + 300}ms both`;
              el.appendChild(lbl);
            }

            new mapboxgl.Marker({ element: el })
              .setLngLat([m.lng, m.lat])
              .addTo(map);
          }

          /* Radar: two expanding rings from the fair middle — the sweep that
             "finds" the pick right before it lands. */
          if (cinematic && !reduced) {
            const center =
              sweepCenter ??
              (persons.length > 0
                ? {
                    lat: persons.reduce((s, m) => s + m.lat, 0) / persons.length,
                    lng: persons.reduce((s, m) => s + m.lng, 0) / persons.length,
                  }
                : { lat: cy, lng: cx });
            timers.push(setTimeout(() => startRadar(map!, center.lat, center.lng), 1100));
          }
        });

      } catch (err) {
        console.error("Map failed to start", err);
        if (!cancelled) setMode("static");
      }
    })();

    /* A map that never finishes loading is worse than no map — but a hidden
       tab pauses requestAnimationFrame, so only run the countdown while the
       page is actually on screen. */
    function armTimeout() {
      timers.push(
        setTimeout(() => {
          if (!cancelled && !loaded && document.visibilityState === "visible") {
            setMode("static");
          }
        }, 9000)
      );
    }
    if (document.visibilityState === "visible") {
      armTimeout();
    } else {
      document.addEventListener("visibilitychange", armTimeout, { once: true });
    }

    function startRadar(map: MapboxMap, lat: number, lng: number) {
      if (cancelled || !map.getStyle()) return;
      try {
        const gid = "roux-radar";
        map.addSource(gid, {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: { type: "Point", coordinates: [lng, lat] },
            properties: {},
          },
        });
        for (const suffix of ["a", "b"]) {
          map.addLayer({
            id: `${gid}-${suffix}`,
            type: "circle",
            source: gid,
            paint: {
              "circle-radius": 0,
              "circle-pitch-alignment": "map",
              "circle-color": VIOLET,
              "circle-opacity": 0.16,
              "circle-stroke-color": VIOLET,
              "circle-stroke-width": 1.5,
              "circle-stroke-opacity": 0.55,
            },
          });
        }

        const rings = [
          { id: `${gid}-a`, start: 0 },
          { id: `${gid}-b`, start: 700 },
        ];
        const DUR = 1200;
        const RADIUS = 190;
        const t0 = performance.now();

        const step = (now: number) => {
          if (cancelled) return;
          if (!map.getStyle()) return; // map torn down
          let done = true;
          for (const ring of rings) {
            const p = (now - t0 - ring.start) / DUR;
            if (p < 1.05) done = false;
            if (p < 0 || !map.getLayer(ring.id)) continue;
            const q = Math.min(1, p);
            const eased = 1 - Math.pow(1 - q, 2);
            map.setPaintProperty(ring.id, "circle-radius", eased * RADIUS);
            map.setPaintProperty(ring.id, "circle-opacity", 0.16 * (1 - q));
            map.setPaintProperty(ring.id, "circle-stroke-opacity", 0.55 * (1 - q));
          }
          if (!done) {
            raf = requestAnimationFrame(step);
          } else {
            try {
              for (const ring of rings) {
                if (map.getLayer(ring.id)) map.removeLayer(ring.id);
              }
              if (map.getSource(gid)) map.removeSource(gid);
            } catch {
              /* map already gone */
            }
          }
        };
        raf = requestAnimationFrame(step);
      } catch (err) {
        console.error("Radar failed", err);
      }
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      for (const t of timers) clearTimeout(t);
      document.removeEventListener("visibilitychange", armTimeout);
      try {
        map?.remove();
      } catch {
        /* already gone */
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerKey, sweepKey, token, zoomPadding, cinematic, mode]);

  const shell = bare
    ? `relative overflow-hidden ${className}`
    : `relative overflow-hidden rounded-2xl border border-[var(--border)] ${className}`;

  const chip = showCoordsChip && pick && (
    <div className="absolute top-3 left-3 z-10 rounded-full bg-white/95 px-3 py-1.5 shadow-sm font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
      LAT {pick.lat.toFixed(4)} · LNG {pick.lng.toFixed(4)}
    </div>
  );

  /* ── Tier 2: a real static map image ── */
  if (token && !staticBroken && (mode === "static" || mode === "diagram")) {
    if (mode === "static") {
      return (
        <div className={shell} style={{ height }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={staticMapUrl(token, markers, height)}
            alt="Map of the group's locations and the fair middle pick."
            className="h-full w-full object-cover"
            onError={() => setStaticBroken(true)}
          />
          {chip}
          <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
            Static view · WebGL off
          </span>
        </div>
      );
    }
  }

  /* ── Tier 3: drawn diagram (no tiles, no token, no WebGL) ── */
  if (mode === "diagram" || staticBroken) {
    return (
      <div className={shell} style={{ height }}>
        <Diagram markers={fits} />
        {chip}
        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-white/90 px-3 py-1 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.14em] text-[var(--gray)]">
          Static view · tiles unavailable
        </span>
      </div>
    );
  }

  return (
    <div className={shell} style={{ height }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
      {chip}
      <style>{`
        @keyframes map-pulse {
          0% { transform: scale(1); opacity: .8; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes marker-drop {
          0% { opacity: 0; transform: translateY(-16px) scale(.4); }
          60% { opacity: 1; transform: translateY(2px) scale(1.08); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes pick-drop {
          0% { opacity: 0; transform: translateY(-34px) scale(.5); }
          55% { opacity: 1; transform: translateY(0) scale(1.08); }
          70% { transform: translateY(-6px) scale(.98); }
          85% { transform: translateY(0) scale(1.02); }
          100% { opacity: 1; transform: none; }
        }
        @keyframes marker-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/**
 * Last-resort map: plotted from the real coordinates so the geometry (and the
 * fair point) is still truthful, drawn in the product's own voice.
 */
function Diagram({ markers }: { markers: MapMarker[] }) {
  const W = 1000;
  const H = 620;
  const pad = 90;

  if (markers.length === 0) {
    return (
      <div className="grid h-full w-full place-items-center bg-[var(--canvas-soft)]">
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.14em] text-[var(--gray)]">
          No coordinates yet
        </span>
      </div>
    );
  }

  const lats = markers.map((m) => m.lat);
  const lngs = markers.map((m) => m.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const spanLat = Math.max(maxLat - minLat, 0.01);
  const spanLng = Math.max(maxLng - minLng, 0.02);

  const project = (m: { lat: number; lng: number }) => ({
    x: pad + ((m.lng - minLng) / spanLng) * (W - pad * 2),
    y: H - pad - ((m.lat - minLat) / spanLat) * (H - pad * 2),
  });

  const persons = markers.filter((m) => m.kind === "person");
  const pick = markers.find((m) => m.kind === "pick");
  const backups = markers.filter((m) => m.kind === "backup");
  const mid =
    persons.length > 0
      ? {
          lat: persons.reduce((s, m) => s + m.lat, 0) / persons.length,
          lng: persons.reduce((s, m) => s + m.lng, 0) / persons.length,
        }
      : null;
  const midPt = mid ? project(mid) : null;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full bg-[var(--canvas-soft)]"
      role="img"
      aria-label="Map of the group's locations and the fair middle pick."
    >
      {/* stylized blocks */}
      <g stroke="var(--border)" strokeWidth="1.5" fill="none">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <line key={`v${i}`} x1={120 + i * 130} y1="0" x2={200 + i * 130} y2={H} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="0" y1={110 + i * 110} x2={W} y2={90 + i * 110} />
        ))}
      </g>

      {/* connectors: everyone to the fair point */}
      {midPt &&
        persons.map((p, i) => {
          const pt = project(p);
          return (
            <line
              key={`c${i}`}
              x1={pt.x}
              y1={pt.y}
              x2={midPt.x}
              y2={midPt.y}
              stroke="var(--violet)"
              strokeWidth="1.6"
              strokeDasharray="5 6"
              opacity="0.5"
            />
          );
        })}

      {/* fair middle */}
      {midPt && (
        <g>
          <circle cx={midPt.x} cy={midPt.y} r="46" fill="var(--violet)" opacity="0.08" />
          <circle cx={midPt.x} cy={midPt.y} r="26" fill="var(--violet)" opacity="0.12" />
          <circle cx={midPt.x} cy={midPt.y} r="9" fill="none" stroke="var(--violet)" strokeWidth="2" />
          <circle cx={midPt.x} cy={midPt.y} r="3.5" fill="var(--violet)" />
        </g>
      )}

      {/* backups */}
      {backups.map((b, i) => {
        const pt = project(b);
        return (
          <circle
            key={`b${i}`}
            cx={pt.x}
            cy={pt.y}
            r="7"
            fill="#c7c0f9"
            stroke="#fff"
            strokeWidth="2.5"
          />
        );
      })}

      {/* people */}
      {persons.map((p, i) => {
        const pt = project(p);
        return (
          <g key={`p${i}`}>
            <circle cx={pt.x} cy={pt.y} r="24" fill="var(--ink)" opacity="0.05" />
            <circle cx={pt.x} cy={pt.y} r="8" fill="var(--ink)" stroke="#fff" strokeWidth="3" />
          </g>
        );
      })}

      {/* pick */}
      {pick &&
        (() => {
          const pt = project(pick);
          return (
            <g>
              <circle cx={pt.x} cy={pt.y} r="34" fill="var(--violet)" opacity="0.16" />
              <circle
                cx={pt.x}
                cy={pt.y}
                r="13"
                fill="var(--violet)"
                stroke="#fff"
                strokeWidth="3.5"
              />
            </g>
          );
        })()}
    </svg>
  );
}
