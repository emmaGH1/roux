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
};

const VIOLET = "#7c6cf6";
const REDUCED = "(prefers-reduced-motion: reduce)";

export function MapView({
  markers,
  zoomPadding = 60,
  height = 360,
  showCoordsChip = false,
  cinematic = false,
  sweepCenter,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    if (!containerRef.current || !token) return;

    /* The map is decoration, never the point. Anything that goes wrong in here
       downgrades to the fallback panel instead of throwing into React, which
       would take the whole page down with the generic client-exception screen.
       mapbox-gl is loaded on demand so its 500 kB never blocks first paint. */
    let cancelled = false;
    let map: MapboxMap | undefined;
    let raf = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED).matches;

    (async () => {
      try {
        const mapboxgl = (await import("mapbox-gl")).default;
        if (cancelled || !containerRef.current) return;

        if (!mapboxgl.supported()) {
          setFailed(true);
          return;
        }

        const fits = markers.filter(
          (m) => Number.isFinite(m.lat) && Number.isFinite(m.lng)
        );
        if (fits.length === 0) return;

        // Start slightly wide, on the people; the fly-in does the rest.
        const cx = fits.reduce((s, m) => s + m.lng, 0) / fits.length;
        const cy = fits.reduce((s, m) => s + m.lat, 0) / fits.length;

        map = new mapboxgl.Map({
          accessToken: token,
          container: containerRef.current,
          style: "mapbox://styles/mapbox/standard",
          center: [cx, cy],
          zoom: reduced ? 13 : 9.4,
          attributionControl: false,
          interactive: false,
        });
        map.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

        map.on("error", (e) => {
          console.error("Mapbox error", e.error);
        });

        map.on("load", () => {
          if (cancelled || !map) return;
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
          const pick = fits.find((m) => m.kind === "pick");

          const personDelay = (i: number) =>
            reduced ? 0 : cinematic ? 350 + i * 160 : 150 + i * 110;
          const backupDelay = (i: number) =>
            reduced ? 0 : cinematic ? 3000 + i * 140 : 250 + persons.length * 110 + i * 110;
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
              dot.style.cssText = `position:absolute;width:14px;height:14px;border-radius:50%;background:#111113;border:2.5px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.25);left:-7px;top:-7px;`;
            }

            dot.style.animation = `${name} ${dur}ms cubic-bezier(.2,.9,.3,1.25) ${delay}ms both`;

            el.appendChild(dot);

            if (m.label) {
              const lbl = document.createElement("div");
              lbl.textContent = m.label;
              lbl.style.cssText = `position:absolute;left:12px;top:-8px;font:600 11px var(--font-sans);color:#111113;background:rgba(255,255,255,.95);padding:2px 8px;border-radius:999px;box-shadow:0 1px 4px rgba(0,0,0,.12);white-space:nowrap;opacity:0;`;
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
            timers.push(
              setTimeout(() => startRadar(map!, center.lat, center.lng), 1100)
            );
          }
        });
      } catch (err) {
        console.error("Map failed to start", err);
        if (!cancelled) setFailed(true);
      }
    })();

    function startRadar(map: MapboxMap, lat: number, lng: number) {
      if (cancelled || !map.getStyle()) return;
      try {
        const gid = `roux-radar`;
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
      try {
        map?.remove();
      } catch {
        /* already gone */
      }
    };
  }, [markers, token, zoomPadding, cinematic, sweepCenter]);

  const pick = markers.find((m) => m.kind === "pick");

  if (!token || failed) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-2 bg-[var(--canvas-soft)] border border-[var(--border)] rounded-2xl px-6 text-center"
        style={{ height }}
      >
        <span className="text-[13px] text-[var(--gray)]">
          {token ? "Map unavailable on this device." : "Map unavailable (token missing)"}
        </span>
        {pick && (
          <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
            LAT {pick.lat.toFixed(4)} · LNG {pick.lng.toFixed(4)}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--border)]" style={{ height }}>
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />
      {showCoordsChip && pick && (
        <div className="absolute top-3 left-3 bg-white/95 rounded-full px-3 py-1.5 shadow-sm font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.08em] text-[var(--gray)]">
          LAT {pick.lat.toFixed(4)} · LNG {pick.lng.toFixed(4)}
        </div>
      )}
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
