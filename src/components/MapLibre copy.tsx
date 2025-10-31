import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./MapLibre.css";

interface MapLibreMapProps {
  className?: string;
}

const MapLibreMap: React.FC<MapLibreMapProps> = ({ className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      // Style if palette night or dusk
      style: 'https://api.maptiler.com/maps/darkmatter/style.json?key=OEkjTgL5nuKgQePmC14C',
      // Style if palette day or bright
      // style: 'https://api.maptiler.com/maps/basic-v2-light/style.json?key=OEkjTgL5nuKgQePmC14C',
      center: [0, 0],
      zoom: 2
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  return <div ref={mapContainer} className={className} style={{ height: '100%' }} />;
};

export default MapLibreMap;