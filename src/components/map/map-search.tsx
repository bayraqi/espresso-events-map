"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { Loader2, MapPin, X } from "lucide-react";
import { useState, useEffect } from "react";

import { useDebounce } from "@/hooks/useDebounce";
import { useMap } from "@/context/map-context";
import { cn } from "@/lib/utils";
import { iconMap, LocationFeature } from "@/lib/mapbox/utils";
import { LocationMarker } from "@/components/location-marker";
import { LocationPopup } from "@/components/location-popup";

export default function MapSearch() {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [results, setResults] = useState<LocationFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<LocationFeature[]>(
    []
  );
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const searchLocations = async () => {
      setIsSearching(true);
      setIsOpen(true);

      try {
        // Photon (OpenStreetMap) geocoding
        const endpoint =
          process.env.NEXT_PUBLIC_GEOCODER_URL ||
          "https://photon.komoot.io/api";
        const url = `${endpoint}/?q=${encodeURIComponent(
          debouncedQuery
        )}&limit=5`;

        const res = await fetch(url);
        const data = await res.json();

        type PhotonFeature = {
          geometry: { coordinates: [number, number] };
          properties: Record<string, unknown>;
        };
        const features: LocationFeature[] = (data?.features || []).map(
          (f: PhotonFeature, idx: number) => {
            const props = f.properties as Record<string, unknown> & {
              name?: string;
              street?: string;
              housenumber?: string;
              city?: string; town?: string; village?: string;
              state?: string; postcode?: string; country?: string;
              osm_value?: string; osm_key?: string; osm_id?: string | number;
            };
            const name: string = props.name || props.street || "Unknown";
            // Compose a friendly place string
            const parts = [
              props.housenumber,
              props.street,
              props.city || props.town || props.village,
              props.state,
              props.postcode,
              props.country,
            ].filter(Boolean);
            const place = parts.join(", ");

            const lf: LocationFeature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [f.geometry.coordinates[0], f.geometry.coordinates[1]],
              },
              properties: {
                id:
                  props.osm_id?.toString?.() ||
                  `${f.geometry.coordinates[0]},${f.geometry.coordinates[1]}-${idx}`,
                name,
                feature_type: props.osm_value || props.osm_key,
                full_address: place,
                place_formatted: place,
                maki: undefined,
                poi_category: props.osm_value ? [props.osm_value] : [],
              },
            };
            return lf;
          }
        );

        setResults(features);
      } catch (err) {
        console.error("Geocoding error:", err);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchLocations();
  }, [debouncedQuery]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    setDisplayValue(value);
  };

  // Handle location selection
  const handleSelect = async (location: LocationFeature) => {
    try {
      setIsSearching(true);

      if (map && location?.geometry?.coordinates) {
        const coordinates = location.geometry.coordinates as [number, number];

        map.flyTo({
          center: coordinates,
          zoom: 14,
          speed: 4,
          duration: 1000,
          essential: true,
        });

        const name = location?.properties?.name || "Selected location";
        setDisplayValue(name);

        setSelectedLocations([location]);
        setSelectedLocation(location);

        setResults([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Selection error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setDisplayValue("");
    setResults([]);
    setIsOpen(false);
    setSelectedLocation(null);
    setSelectedLocations([]);
  };

  return (
    <>
      <section className="absolute top-4 left-1/2 sm:left-4 z-10 w-[90vw] sm:w-[350px] -translate-x-1/2 sm:translate-x-0 rounded-lg shadow-lg">
        <Command className="rounded-lg">
          <div
            className={cn(
              "w-full flex items-center justify-between px-3 gap-1",
              isOpen && "border-b"
            )}
          >
            <CommandInput
              placeholder="Search locations..."
              value={displayValue}
              onValueChange={handleInputChange}
              className="flex-1"
            />
            {displayValue && !isSearching && (
              <X
                className="size-4 shrink-0 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                onClick={clearSearch}
              />
            )}
            {isSearching && (
              <Loader2 className="size-4 shrink-0 text-primary animate-spin" />
            )}
          </div>

          {isOpen && (
            <CommandList className="max-h-60 overflow-y-auto">
              {!query.trim() || isSearching ? null : results.length === 0 ? (
                <CommandEmpty className="py-6 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-sm font-medium">No locations found</p>
                    <p className="text-xs text-muted-foreground">
                      Try a different search term
                    </p>
                  </div>
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {results.map((location, idx) => (
                    <CommandItem
                      key={location.properties.id || idx}
                      onSelect={() => handleSelect(location)}
                      value={`${location.properties.name} ${location.properties.place_formatted} ${location.properties.id || idx}`}
                      className="flex items-center py-3 px-2 cursor-pointer hover:bg-accent rounded-md"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="bg-primary/10 p-1.5 rounded-full">
                          {location.properties.maki && iconMap[location.properties.maki] ? (
                            iconMap[location.properties.maki]
                          ) : (
                            <MapPin className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium truncate max-w-[270px]">
                            {location.properties.name}
                          </span>
                          <span className="text-xs text-muted-foreground truncate max-w-[270px]">
                            {location.properties.place_formatted}
                          </span>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </section>

      {selectedLocations.map((location) => (
        <LocationMarker
          key={location.properties.id}
          location={location}
          onHover={(data) => setSelectedLocation(data)}
        />
      ))}

      {selectedLocation && (
        <LocationPopup
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </>
  );
}
