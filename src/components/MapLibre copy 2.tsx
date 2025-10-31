import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./MapLibre.css";

interface MapLibreMapProps {
  className?: string;
  palette?: 'day' | 'dusk' | 'night' | 'bright';
}

const STYLE_URLS: Record<string, string> = {
  day: 'https://api.maptiler.com/maps/basic-v2-light/style.json?key=OEkjTgL5nuKgQePmC14C',
  bright: 'https://api.maptiler.com/maps/bright-v2/style.json?key=OEkjTgL5nuKgQePmC14C',
  dusk: 'https://api.maptiler.com/maps/019a355a-5693-7cb0-af34-7237ad9943fb/style.json?key=OEkjTgL5nuKgQePmC14C',
  night: 'https://api.maptiler.com/maps/019a355b-f994-7381-a1ef-862572c71d39/style.json?key=OEkjTgL5nuKgQePmC14C',
  // If self-hosting, replace with: 'http://localhost:8080/styles/basic-v2/style.json' etc.
};

const MapLibreMap: React.FC<MapLibreMapProps> = ({ className, palette = 'day' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // create map once
  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_URLS[palette],
      center: [0, 0],
      zoom: 2
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // create once

  // swap style when palette changes
  useEffect(() => {
    if (!map.current) return;
    const url = STYLE_URLS[palette] ?? STYLE_URLS.day;
    // replace whole style (this reloads sources/layers properly)
    map.current.setStyle(url);
  }, [palette]);

  return <div ref={mapContainer} className={className} style={{ height: '100%' }} />;
};

export default MapLibreMap;