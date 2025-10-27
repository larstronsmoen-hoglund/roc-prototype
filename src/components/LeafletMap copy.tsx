import { useEffect, useRef } from "react";
import "./LeafletMap.css";
declare const L: any; // use global Leaflet from CDN

export default function LeafletMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create the map
    const map = L.map(mapRef.current, {
      attributionControl: false,
      zoomControl: false
    });

    // Tile layer
    L.tileLayer("http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Sample markers
    const vessels = [
      { name: "A3601", lat: 55.0, lon: -35.0 },
      { name: "A3602", lat: 50.5, lon: -20.0 },
      { name: "A3603", lat: 62.0, lon:  -6.0 },
      { name: "A3604", lat: 48.0, lon: -45.0 },
      { name: "A3605", lat: 58.96, lon: -3.18 },
    ];
    const markers = vessels.map(v =>
      L.marker([v.lat, v.lon]).addTo(map).bindPopup(v.name,)
    );
    const group = L.featureGroup(markers);
    map.fitBounds(group.getBounds().pad(0.2));

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  return (
    <div
      ref={mapRef}
      style={{
        position: "absolute",
        top: "0", // or 'var(--app-components-topbar-touch-target-size)'
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
}