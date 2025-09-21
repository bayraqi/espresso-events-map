export type Event = {
  id: string;
  name: string;
  city: string;
  country: string;
  date: string; // ISO date string
  type: 'past' | 'upcoming';
  description: string;
  attendees?: number;
  website?: string;
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  highlights?: string[];
  speakers?: string[];
  venue?: string;
  images?: string[];
  ticketPrice?: string;
  // Prefer direct geographic coordinates when available
  longitude?: number;
  latitude?: number;
  coordinates: { x: number; y: number }; // 0-100 scaled reference
};

export type EventLocation = {
  id: string;
  name: string;
  city: string;
  country: string;
  date: string;
  type: 'past' | 'upcoming';
  description: string;
  attendees?: number;
  website?: string;
  socialMedia?: Event['socialMedia'];
  highlights?: string[];
  speakers?: string[];
  venue?: string;
  images?: string[];
  ticketPrice?: string;
  longitude: number;
  latitude: number;
};
