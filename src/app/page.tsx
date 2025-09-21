"use client";

import { useRef } from "react";

import MapProvider from "@/lib/mapbox/provider";
import MapStyles from "@/components/map/map-styles";
import MapCotrols from "@/components/map/map-controls";
import EventOverlay from "@/components/events/event-overlay";

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="w-screen h-screen p-4 sm:p-6 lg:p-8 bg-background">
      <div className="relative h-full w-full rounded-2xl overflow-hidden border shadow-sm">
        <div
          id="map-container"
          ref={mapContainerRef}
          className="absolute inset-0 h-full w-full"
        />

        <MapProvider
          mapContainerRef={mapContainerRef}
          initialViewState={{
            longitude: 0,
            latitude: 0,
            zoom: 1,
          }}
        >
          <MapCotrols />
          <MapStyles />

          <EventOverlay />
        </MapProvider>
      </div>
    </div>
  );
}
