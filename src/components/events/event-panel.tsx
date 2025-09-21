"use client";

import React, { useRef } from "react";
import type { EventLocation } from "@/lib/events/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, MapPin, CalendarDays, Users, X } from "lucide-react";

type EventPanelProps = {
  event: EventLocation | null;
  side: "left" | "right";
  width?: number; // px
  open: boolean;
  onClose: () => void;
};

export default function EventPanel({ event, side, width = 400, open, onClose }: EventPanelProps) {
  const translate = side === "right" ? "translate-x-full" : "-translate-x-full";
  const startX = useRef<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0]?.clientX ?? null;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current == null) return;
    const endX = e.changedTouches[0]?.clientX ?? startX.current;
    const delta = endX - startX.current;
    const threshold = 50;
    // Swipe outward based on side closes the panel
    const shouldClose = side === "right" ? delta > threshold : delta < -threshold;
    if (shouldClose) onClose();
    startX.current = null;
  };
  return (
    <aside
      className={[
        "pointer-events-auto absolute top-0 h-full z-20 bg-card text-card-foreground shadow-2xl border",
        side === "right" ? "right-0" : "left-0",
        "transition-transform duration-300 ease-out",
        open ? "translate-x-0" : translate,
      ].join(" ")}
      style={{ width }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b relative">
          <h2 className="font-semibold text-lg truncate pr-8">{event?.name ?? "Event"}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2"
            onClick={onClose}
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto space-y-4">
          {event && (
            <>
              {event.images?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={event.images[0]}
                  alt={event.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              )}
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> {new Date(event.date).toDateString()}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {event.city}, {event.country}
              </div>
              {event.venue && <div className="text-sm">Venue: {event.venue}</div>}
              {event.attendees && (
                <div className="text-sm text-muted-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" /> {event.attendees.toLocaleString()} attendees
                </div>
              )}
              <p className="text-sm leading-6 whitespace-pre-line">{event.description}</p>
              {event.highlights && event.highlights.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {event.highlights.slice(0, 6).map((h, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {h}
                    </Badge>
                  ))}
                </div>
              )}
              {event.speakers && event.speakers.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-1">Speakers</div>
                  <div className="flex flex-wrap gap-1">
                    {event.speakers.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                {event.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center"
                    onClick={() => window.open(event.website!, "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-1" /> Website
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
