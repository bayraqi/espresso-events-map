"use client";

import React from "react";
import Marker from "@/components/map/map-marker";
import type { EventLocation } from "@/lib/events/types";

type EventMarkerProps = {
  event: EventLocation;
  onHover?: (event: EventLocation | null) => void;
  onClick?: (event: EventLocation) => void;
  logoSrc?: string; // path to espresso logo in public
};

export default function EventMarker({ event, onHover, onClick, logoSrc }: EventMarkerProps) {
  const resolvedLogo = logoSrc || process.env.NEXT_PUBLIC_ESPRESSO_LOGO || "/espresso.svg";
  return (
    <Marker
      longitude={event.longitude}
      latitude={event.latitude}
      data={event}
      onHover={({ isHovered, data }) => {
        if (!onHover) return;
        onHover(isHovered ? (data as EventLocation) : null);
      }}
      onClick={({ data }) => onClick?.(data as EventLocation)}
      anchor="bottom"
      offset={[0, 8]}
    >
      <div className="rounded-full shadow-lg size-9 sm:size-10 bg-white/90 border border-black/10 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform">
        {/* Logo image with fallback letter */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedLogo}
          alt="Espresso"
          className="w-6 h-6 sm:w-7 sm:h-7 object-contain"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const fallback = target.nextElementSibling as HTMLElement | null;
            if (fallback) fallback.style.display = "flex";
          }}
        />
        <div className="hidden items-center justify-center w-6 h-6 sm:w-7 sm:h-7 text-xs font-bold text-white bg-rose-500 rounded-full">
          E
        </div>
      </div>
    </Marker>
  );
}
