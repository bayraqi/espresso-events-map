"use client";

import mapboxgl from "mapbox-gl";

function cssVar(name: string, fallback?: string): string | undefined {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name);
  const trimmed = v?.trim();
  return trimmed || fallback;
}

export function getEspressoPalette() {
  return {
    background: cssVar("--background", "#FCEBDE"),
    foreground: cssVar("--foreground", "#130401"),
    primary: cssVar("--primary", "#B67237"),
    secondary: cssVar("--secondary", "#DE9E67"),
    muted: cssVar("--muted", "#F5E3D6"),
    accent: cssVar("--accent", "#DE9E67"),
    border: cssVar("--border", "#E8CBB3"),
    card: cssVar("--card", "#FFFFFF"),
    water: cssVar("--chart-1", "#1EB6F8"),
    park: cssVar("--chart-3", "#F0E89D"),
    parkStrong: cssVar("--chart-4", "#B9AD3E"),
    road: cssVar("--primary", "#B67237"),
    roadSecondary: cssVar("--secondary", "#DE9E67"),
    label: cssVar("--foreground", "#130401"),
  } as const;
}

function trySetPaint(
  map: mapboxgl.Map,
  layerId: string,
  prop: string,
  value: unknown
) {
  try {
    if (map.getLayer(layerId)) {
      map.setPaintProperty(layerId, prop, value);
    }
  } catch {}
}

function recolorLayer(map: mapboxgl.Map, layer: mapboxgl.AnyLayer, p: ReturnType<typeof getEspressoPalette>) {
  const id = layer.id.toLowerCase();
  switch (layer.type) {
    case "background": {
      trySetPaint(map, layer.id, "background-color", p.background);
      break;
    }
    case "fill": {
      if (id.includes("water")) {
        trySetPaint(map, layer.id, "fill-color", p.water);
      } else if (id.includes("park") || id.includes("green") || id.includes("wood") || id.includes("forest") || id.includes("grass")) {
        trySetPaint(map, layer.id, "fill-color", p.park);
      } else if (id.includes("building")) {
        trySetPaint(map, layer.id, "fill-color", p.card);
      } else if (id.includes("land") || id.includes("landuse") || id.includes("landcover")) {
        trySetPaint(map, layer.id, "fill-color", p.muted);
      }
      break;
    }
    case "fill-extrusion": {
      if (id.includes("building")) {
        trySetPaint(map, layer.id, "fill-extrusion-color", p.card);
      }
      break;
    }
    case "line": {
      if (id.includes("water")) {
        trySetPaint(map, layer.id, "line-color", p.water);
      } else if (id.includes("boundary")) {
        trySetPaint(map, layer.id, "line-color", p.border);
      } else if (id.includes("road") || id.includes("bridge") || id.includes("tunnel")) {
        const color = id.includes("motorway") || id.includes("primary") ? p.road : p.roadSecondary;
        trySetPaint(map, layer.id, "line-color", color);
      }
      break;
    }
    case "symbol": {
      trySetPaint(map, layer.id, "text-color", p.label);
      trySetPaint(map, layer.id, "icon-color", p.label);
      // subtle halo for contrast
      trySetPaint(map, layer.id, "text-halo-color", p.background);
      trySetPaint(map, layer.id, "text-halo-width", 0.5);
      break;
    }
    default:
      break;
  }
}

export function applyEspressoTheme(map: mapboxgl.Map) {
  // Ensure style is ready before trying to change paint properties
  if (!map || typeof map.isStyleLoaded !== "function" || !map.isStyleLoaded()) {
    return;
  }
  const style = map.getStyle();
  if (!style || !style.layers) return;
  const p = getEspressoPalette();
  for (const layer of style.layers) {
    recolorLayer(map, layer as mapboxgl.AnyLayer, p);
  }
}
