"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";

import { useMap } from "@/context/map-context";

type Props<T = unknown> = {
  longitude: number;
  latitude: number;
  data: T;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: T;
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: T;
  }) => void;
  children?: React.ReactNode;
} & MarkerOptions;

export default function Marker<T = unknown>({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props<T>) {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement | null>(null);
  const markerObjRef = useRef<mapboxgl.Marker | null>(null);

  const handleHover = (isHovered: boolean) => {
    if (onHover && markerObjRef.current) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker: markerObjRef.current,
        data,
      });
    }
  };

  const handleClick = () => {
    if (onClick && markerObjRef.current) {
      onClick({
        position: { longitude, latitude },
        marker: markerObjRef.current,
        data,
      });
    }
  };

  useEffect(() => {
    const markerEl = markerRef.current;
    if (!map || !markerEl) return;

    const handleMouseEnter = () => handleHover(true);
    const handleMouseLeave = () => handleHover(false);

    // Add event listeners
    markerEl.addEventListener("mouseenter", handleMouseEnter);
    markerEl.addEventListener("mouseleave", handleMouseLeave);
    markerEl.addEventListener("click", handleClick);

    // Marker options
    const options = {
      element: markerEl,
      ...props,
    };

    markerObjRef.current = new mapboxgl.Marker(options)
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      // Cleanup on unmount
      if (markerObjRef.current) {
        markerObjRef.current.remove();
        markerObjRef.current = null;
      }
      if (markerEl) {
        markerEl.removeEventListener("mouseenter", handleMouseEnter);
        markerEl.removeEventListener("mouseleave", handleMouseLeave);
        markerEl.removeEventListener("click", handleClick);
      }
    };
  }, [map, longitude, latitude, props]);

  return (
    <div>
      <div ref={markerRef}>{children}</div>
    </div>
  );
}
