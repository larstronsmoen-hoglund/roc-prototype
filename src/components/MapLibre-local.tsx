import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import "./MapLibre.css";

// Import the OB vessel icons
import "@ocean-industries-concept-lab/openbridge-webcomponents/dist/icons/icon-vessel-type-generic-filled.js";
import "@ocean-industries-concept-lab/openbridge-webcomponents/dist/icons/icon-own-ship-no-command-index.js";


interface MapLibreMapProps {
  className?: string;
  palette?: 'day' | 'dusk' | 'night' | 'bright';
}

// Map style URLs for different palettes
const STYLE_URLS: Record<string, string> = {
  day: '../../protomaps/styles/day.json',
  bright: '../../protomaps/styles/bright.json',
  dusk: '../../protomaps/styles/dusk.json',
  night: '../../protomaps/styles/night.json',
  // When self-hosting on OI servers, replace URLs
};

// Add vessel type
type Vessel = { name: string; lat: number; lon: number; heading: number; mode: string };


// Render speed Icon - CONSIDER MAKING THE VESSEL ICON GENERATE INTO COMPONENT LATER

// Minimal icon SVG string helper (16x12)
function renderSpeedIcon(
  mode: string, 
  useCurrentColor = true // set true to allow CSS coloring via `color`
): string {
  const paths: Record<string, string> = {
    Slow: 'M8 2.25C8.41421 2.25 8.75 2.58579 8.75 3V9C8.75 9.41421 8.41421 9.75 8 9.75C7.58579 9.75 7.25 9.41421 7.25 9V3C7.25 2.58579 7.58579 2.25 8 2.25Z',
    Mid: 'M6 2.25C6.41421 2.25 6.75 2.58579 6.75 3V9C6.75 9.41421 6.41421 9.75 6 9.75C5.58579 9.75 5.25 9.41421 5.25 9V3C5.25 2.58579 5.58579 2.25 6 2.25ZM10 2.25C10.4142 2.25 10.75 2.58579 10.75 3V9C10.75 9.41421 10.4142 9.75 10 9.75C9.58579 9.75 9.25 9.41421 9.25 9V3C9.25 2.58579 9.58579 2.25 10 2.25Z',
    Fast: 'M4 2.25C4.41421 2.25 4.75 2.58579 4.75 3V9C4.75 9.41421 4.41421 9.75 4 9.75C3.58579 9.75 3.25 9.41421 3.25 9L3.25 3C3.25 2.58579 3.58579 2.25 4 2.25ZM8 2.25C8.41421 2.25 8.75 2.58579 8.75 3V9C8.75 9.41421 8.41421 9.75 8 9.75C7.58579 9.75 7.25 9.41421 7.25 9V3C7.25 2.58579 7.58579 2.25 8 2.25ZM12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V9C12.75 9.41421 12.4142 9.75 12 9.75C11.5858 9.75 11.25 9.41421 11.25 9V3C11.25 2.58579 11.5858 2.25 12 2.25Z',
    Anchored: 'M8.75 3.25H10.75V4.75H8.75V8.38379C8.81975 8.36184 8.88925 8.33765 8.95703 8.30957C9.26022 8.18394 9.53551 7.99964 9.76758 7.76758C9.99964 7.53551 10.1839 7.26022 10.3096 6.95703C10.4352 6.65372 10.5 6.3283 10.5 6H12C12 6.52517 11.8962 7.04506 11.6953 7.53027C11.4943 8.01558 11.1996 8.45669 10.8281 8.82812C10.4567 9.19956 10.0156 9.49429 9.53027 9.69531C9.04506 9.89624 8.52517 10 8 10C7.47483 10 6.95494 9.89624 6.46973 9.69531C5.98442 9.49429 5.54331 9.19956 5.17188 8.82812C4.80044 8.45669 4.50571 8.01558 4.30469 7.53027C4.10376 7.04506 4 6.52517 4 6H5.5C5.5 6.3283 5.56479 6.65372 5.69043 6.95703C5.81606 7.26022 6.00036 7.53551 6.23242 7.76758C6.46449 7.99964 6.73978 8.18394 7.04297 8.30957C7.11075 8.33765 7.18025 8.36184 7.25 8.38379V4.75H5.25V3.25H7.25V1.25H8.75V3.25Z',
    Stopped: 'M8 1C10.7614 1 13 3.23858 13 6C13 8.76142 10.7614 11 8 11C5.23858 11 3 8.76142 3 6C3 3.23858 5.23858 1 8 1ZM8 2.5C6.067 2.5 4.5 4.067 4.5 6C4.5 7.933 6.067 9.5 8 9.5C9.933 9.5 11.5 7.933 11.5 6C11.5 4.067 9.933 2.5 8 2.5Z'
  };
  const d = paths[mode];
  if (!d) throw new Error(`Unknown mode: ${mode}`);

  // Use currentColor to style via CSS
  const fill = useCurrentColor ? 'currentColor' : '#535353';
  return `<svg width="16" height="12" viewBox="0 0 16 12" xmlns="http://www.w3.org/2000/svg" fill="none" role="img" aria-label="${mode}">
    <path d="${d}" fill="${fill}"/>
  </svg>`;
}


// New custom marker element concept 64x64px
const createVesselMarker = (name: string, heading: number, mode: string) => {
  const el = document.createElement('div');
  el.className = 'vessel-marker';
  el.style.width = '64px';
  el.style.height = '64px';
  
  // Get the last character from the vessel name
  const lastChar = name.slice(-1);
  
  const html = `
    <div class="vessel-wrap">
      <!-- rotating bottom icon only -->
      <div class="rotating-wrap" style="transform: rotate(${heading}deg);">
        <obi-vessel-type-generic-filled
          class="vessel-icon bottom"
          useCssColor="true"
          use-css-color
        ></obi-vessel-type-generic-filled>
        
        <!-- centered mode icon with Y offset -->
        <div class="vessel-mode-icon" style="--mode-offset-y: 14px;">
          ${renderSpeedIcon(mode, true)}
        </div>

      </div>

      <!-- static top icon with text overlay -->
      <div class="static-wrap">
        <obi-own-ship-no-command-generic
          class="vessel-icon top"
          useCssColor="true"
          use-css-color
        ></obi-own-ship-no-command-generic>
        <span class="vessel-text">${lastChar}</span>
      </div>
    </div>
  `;
  
  el.innerHTML = html;
  return el;
};

const MapLibreMap: React.FC<MapLibreMapProps> = ({ className, palette = 'day' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Demo vessels data

const vessels: Vessel[] = [
  { name: "A3601", lat: 55.0,  lon: -35.0, heading: 317, mode: "Fast" },
  { name: "A3602", lat: 50.5,  lon: -20.0, heading: 142, mode: "Mid" },
  { name: "A3603", lat: 60.0,  lon:  -8.0, heading:  28, mode: "Slow" },
  { name: "A3604", lat: 48.0,  lon: -45.0, heading: 203, mode: "Stopped" },
  { name: "A3605", lat: 58.96, lon:  -8.18, heading:  81, mode: "Anchored" },
];

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE_URLS[palette],
      center: [-28, 52],
      zoom: 4
      
    });
    // Add navigation controls (zoom buttons). TODO implement palette styling
     map.current.addControl(new maplibregl.NavigationControl());
    // Add markers when map loads
    map.current.on('load', () => {
      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add vessel markers
      const bounds = new maplibregl.LngLatBounds();
      
      vessels.forEach((v) => {
        const marker = new maplibregl.Marker({
          element: createVesselMarker(v.name, v.heading, v.mode),
          anchor: 'center'
        })
          .setLngLat([v.lon, v.lat])
          .addTo(map.current!);



        // Store marker reference
        markersRef.current.push(marker);
        
        // Extend bounds to include this point
        bounds.extend([v.lon, v.lat]);
      });


    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // swap style when palette changes
  useEffect(() => {
    if (!map.current) return;
    const url = STYLE_URLS[palette] ?? STYLE_URLS.day;
    // replace whole style (this reloads sources/layers properly)
    map.current.setStyle(url);
  }, [palette]);

  return <div ref={mapContainer} className={className} style={{ height: '100%', width: '100%' }} />;
};

export default MapLibreMap;



