"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import { MapContext } from "@/context/map-context";
import { applyEspressoTheme } from "@/lib/mapbox/theme";
import { useTheme } from "next-themes";

type MapComponentProps = {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
};

export default function MapProvider({
  mapContainerRef,
  initialViewState,
  children,
}: MapComponentProps) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!mapContainerRef.current || map.current) return;

    // Add your Mapbox access token here
    // You can get one from https://www.mapbox.com/
    const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Mapbox access token is missing");
      return;
    }

    const styleUrl =
      process.env.NEXT_PUBLIC_MAP_STYLE_URL || "mapbox://styles/mapbox/streets-v11";

    map.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: styleUrl,
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      projection: "globe",
      attributionControl: false,
      logoPosition: "bottom-right",
      accessToken: accessToken,
    });

    map.current.on("load", () => {
      setLoaded(true);
      // Apply Espresso theming once style is ready
      applyEspressoTheme(map.current!);
    });

    // Re-apply theming when style reloads (e.g., after setStyle)
    map.current.on("styledata", () => {
      applyEspressoTheme(map.current!);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialViewState, mapContainerRef]);

  // Re-apply when theme changes (variables update)
  useEffect(() => {
    if (!map.current || !map.current.isStyleLoaded()) return;
    applyEspressoTheme(map.current);
  }, [resolvedTheme]);

  return (
    <div className="z-[1000]">
      <MapContext.Provider value={{ map: map.current }}>
        {children}
      </MapContext.Provider>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-[1000]">
          <div className="text-lg font-medium">Loading map...</div>
        </div>
      )}
    </div>
  );
}
