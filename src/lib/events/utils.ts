import type { Event, EventLocation } from './types';
import { eventsData } from './data';

// Convert the Bolt-normalized coordinates (0-100) to lon/lat using a simple equirectangular mapping
export function toLngLat(x: number, y: number): { longitude: number; latitude: number } {
  const longitude = -180 + (x / 100) * 360;
  const latitude = 90 - (y / 100) * 180;
  return { longitude, latitude };
}

export function mapEvent(e: Event): EventLocation {
  const { longitude, latitude } =
    typeof e.longitude === 'number' && typeof e.latitude === 'number'
      ? { longitude: e.longitude, latitude: e.latitude }
      : toLngLat(e.coordinates.x, e.coordinates.y);
  return {
    id: e.id,
    name: e.name,
    city: e.city,
    country: e.country,
    date: e.date,
    type: e.type,
    description: e.description,
    attendees: e.attendees,
    website: e.website,
    socialMedia: e.socialMedia,
    highlights: e.highlights,
    speakers: e.speakers,
    venue: e.venue,
    images: e.images,
    ticketPrice: e.ticketPrice,
    longitude,
    latitude,
  };
}

export function listEventLocations(): EventLocation[] {
  return eventsData.map(mapEvent);
}

export function getEventLocationById(id: string): EventLocation | undefined {
  const e = eventsData.find((ev) => ev.id === id);
  return e ? mapEvent(e) : undefined;
}
