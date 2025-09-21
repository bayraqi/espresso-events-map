"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { PaddingOptions } from "mapbox-gl";
import { listEventLocations } from "@/lib/events/utils";
import type { EventLocation } from "@/lib/events/types";
import EventMarker from "@/components/events/event-marker";
import Popup from "@/components/map/map-popup";
import EventPanel from "@/components/events/event-panel";
import { useMap } from "@/context/map-context";

export default function EventOverlay() {
  const { map } = useMap();
  const [hoveredEvent, setHoveredEvent] = useState<EventLocation | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventLocation | null>(null);
  const [panelSide, setPanelSide] = useState<"left" | "right">("right");
  const [panelWidth, setPanelWidth] = useState(400);

  useEffect(() => {
    const computeWidth = () => {
      const w = window.innerWidth;
      if (w < 380) return Math.max(260, w - 32);
      if (w < 640) return 320;
      if (w < 768) return 360;
      return 400;
    };
    const apply = () => setPanelWidth(computeWidth());
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedEvent(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const events = useMemo(() => listEventLocations(), []);

  const openPanelForEvent = useCallback(
    (ev: EventLocation) => {
      if (!map) return;
      const p = map.project([ev.longitude, ev.latitude]);
      const side = p.x < window.innerWidth / 2 ? "right" : "left";
      setPanelSide(side);
      setSelectedEvent(ev);

      const basePadding = { top: 24, bottom: 24, left: 24, right: 24 } as const;
      const newPadding: PaddingOptions = { ...basePadding };
      if (side === "right") newPadding.right = panelWidth + 24;
      else newPadding.left = panelWidth + 24;
      const offsetX = side === "right" ? -panelWidth / 4 : panelWidth / 4;

      map.easeTo({
        padding: newPadding,
        offset: [offsetX, 0],
        duration: 400,
        center: [ev.longitude, ev.latitude],
        zoom: Math.max(map.getZoom(), 10),
      });
    },
    [map, panelWidth]
  );

  const closePanel = useCallback(() => {
    if (!map) return;
    setSelectedEvent(null);
    map.easeTo({ padding: { top: 0, bottom: 0, left: 0, right: 0 }, duration: 300 });
  }, [map]);

  return (
    <>
      {events.map((ev) => (
        <EventMarker
          key={ev.id}
          event={ev}
          onHover={(e) => setHoveredEvent(e)}
          onClick={(e) => openPanelForEvent(e)}
        />
      ))}

      {hoveredEvent && (
        <Popup
          latitude={hoveredEvent.latitude}
          longitude={hoveredEvent.longitude}
          closeButton={false}
          closeOnClick={false}
          offset={10}
          className="event-tooltip"
        >
          <div className="text-sm">
            {hoveredEvent.images?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hoveredEvent.images[0]}
                alt={hoveredEvent.name}
                className="w-full h-24 object-cover rounded-md mb-2"
              />
            )}
            <div className="font-medium leading-tight truncate">
              {hoveredEvent.name}
            </div>
            <div className="text-xs text-muted-foreground">
              {hoveredEvent.city}, {hoveredEvent.country}
            </div>
          </div>
        </Popup>
      )}

      <div className="pointer-events-none">
        <EventPanel
          event={selectedEvent}
          side={panelSide}
          width={panelWidth}
          open={!!selectedEvent}
          onClose={closePanel}
        />
      </div>
    </>
  );
}
