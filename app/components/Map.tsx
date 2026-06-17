"use client";

import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { FaHome, FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

interface MapProps {
  center?: number[];
  label?: string;
}

const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const Map: React.FC<MapProps> = ({ center, label }) => {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;

    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const customIcon = L.divIcon({
    className: "custom-marker",
    html: `
      <div class="w-12 h-12 rounded-full bg-neutral-900 text-white flex items-center justify-center shadow-lg border-4 border-white">
        <span style="font-size: 20px;">⌂</span>
      </div>
    `,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

  return (
    <div className="relative h-[42vh] w-full rounded-3xl overflow-hidden bg-neutral-100">
      {label && (
        <div className="absolute top-4 left-4 right-4 z-[999] bg-white rounded-full shadow-md px-6 py-4 flex items-center gap-3 text-sm text-neutral-700">
          <FaMapMarkerAlt className="text-neutral-800" />
          <span className="truncate">{label}</span>
        </div>
      )}

      <MapContainer
        center={(center as L.LatLngExpression) || [16.0471, 108.2068]}
        zoom={center ? 13 : 5}
        scrollWheelZoom={false}
        zoomControl={true}
        className="h-full w-full"
      >
        <TileLayer url={url} attribution={attribution} />

        {center && (
          <Marker
            position={center as L.LatLngExpression}
            icon={customIcon}
          />
        )}
      </MapContainer>

  
    </div>
  );
};

export default Map;