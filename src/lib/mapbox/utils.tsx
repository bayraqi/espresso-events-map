import {
  Coffee,
  Utensils,
  ShoppingBag,
  Hotel,
  Dumbbell,
  Landmark,
  Store,
  Banknote,
  GraduationCap,
  Shirt,
  Stethoscope,
  Home,
} from "lucide-react";

export const iconMap: { [key: string]: React.ReactNode } = {
  café: <Coffee className="h-5 w-5" />,
  cafe: <Coffee className="h-5 w-5" />,
  coffee: <Coffee className="h-5 w-5" />,
  restaurant: <Utensils className="h-5 w-5" />,
  food: <Utensils className="h-5 w-5" />,
  hotel: <Hotel className="h-5 w-5" />,
  lodging: <Hotel className="h-5 w-5" />,
  gym: <Dumbbell className="h-5 w-5" />,
  bank: <Banknote className="h-5 w-5" />,
  shopping: <ShoppingBag className="h-5 w-5" />,
  store: <Store className="h-5 w-5" />,
  government: <Landmark className="h-5 w-5" />,
  school: <GraduationCap className="h-5 w-5" />,
  hospital: <Stethoscope className="h-5 w-5" />,
  clothing: <Shirt className="h-5 w-5" />,
  home: <Home className="h-5 w-5" />,
};

// Provider-agnostic suggestion item used in UI lists
export type LocationSuggestion = {
  id: string;
  name: string;
  place_formatted: string;
  maki?: string;
};

// Provider-agnostic feature used across markers and popups
export type LocationFeature = {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
  properties: {
    id?: string;
    name: string;
    feature_type?: string;
    address?: string;
    full_address?: string;
    place_formatted?: string;
    maki?: string;
    poi_category?: string[];
    brand?: string[];
    external_ids?: Record<string, string>;
    metadata?: Record<string, unknown>;
    bbox?: [number, number, number, number];
    operational_status?: string;
  };
};
