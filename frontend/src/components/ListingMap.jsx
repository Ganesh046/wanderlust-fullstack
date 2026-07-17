import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Vite packaging Leaflet marker icon asset workarounds
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const ListingMap = ({ coordinates, title, location, country }) => {
  const mapInstanceRef = useRef(null);
  const mapContainerId = "map-container";

  useEffect(() => {
    if (
      coordinates &&
      Array.isArray(coordinates) &&
      coordinates.length === 2 &&
      coordinates[0] !== undefined &&
      coordinates[1] !== undefined &&
      !isNaN(coordinates[0]) &&
      !isNaN(coordinates[1]) &&
      !mapInstanceRef.current
    ) {
      const [lon, lat] = coordinates;

      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });

      const map = L.map(mapContainerId, {
        scrollWheelZoom: false,
        attributionControl: false,
      }).setView([lat, lon], 10);
      mapInstanceRef.current = map;

      // Enable scroll zoom on click/interaction
      map.on("click", () => {
        map.scrollWheelZoom.enable();
      });

      // Disable scroll zoom when mouse leaves the map container
      map.on("mouseout", () => {
        map.scrollWheelZoom.disable();
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([lat, lon])
        .addTo(map)
        .bindPopup(
          `<b>${title}</b><br>${location}, ${country}`,
        );
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, title, location, country]);

  if (!coordinates) return null;

  return (
    <div className="map-section">
      <h3 className="map-title">Where you'll be</h3>
      <div id={mapContainerId} className="map-wrapper"></div>
    </div>
  );
};

export default ListingMap;
