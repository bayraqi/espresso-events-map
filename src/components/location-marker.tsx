import { LocationFeature } from "@/lib/mapbox/utils";
import Marker from "./map/map-marker";

interface LocationMarkerProps {
  location: LocationFeature;
  onHover: (data: LocationFeature) => void;
}

export function LocationMarker({ location, onHover }: LocationMarkerProps) {
  const logo = process.env.NEXT_PUBLIC_ESPRESSO_LOGO || "/espresso.svg";
  return (
    <Marker
      longitude={location.geometry.coordinates[0]}
      latitude={location.geometry.coordinates[1]}
      data={location}
      onHover={({ data }) => {
        onHover(data);
      }}
    >
      <div className="rounded-full shadow-lg size-9 sm:size-10 bg-white/90 border border-black/10 flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
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
