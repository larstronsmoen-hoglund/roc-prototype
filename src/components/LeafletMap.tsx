import { useEffect, useRef } from "react";
import "./LeafletMap.css";

// Register the OB vessel icon custom element
import "@ocean-industries-concept-lab/openbridge-webcomponents/dist/icons/icon-vessel-generic-default-filled.js";

declare const L: any; // Leaflet from CDN

type Theme = "bright" | "day" | "dusk" | "night";

/** CARTO Positron for bright/day, Dark Matter for dusk/night */
function tileConfigFor(theme: Theme) {
  const isLight = theme === "bright" || theme === "day";
  return {
    url: isLight
      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "Map tiles © CARTO, Data © OpenStreetMap contributors",
    maxZoom: 20,
    detectRetina: true,
  };
}

/** Keep your preference: day=0.4, night=0.3; others full */
function opacityFor(theme: Theme) {
  if (theme === "night") return 0.3;
  if (theme === "day") return 0.4;
  return 1.0; // bright / dusk
}

/** Neighbor logic per Brilliance GUI: night << dusk >> day >> bright */
function neighborsFor(theme: Theme): Theme[] {
  switch (theme) {
    case "dusk":
      return ["night", "day"];
    case "day":
      return ["dusk", "bright"];
    case "bright":
      return ["day"];
    case "night":
      return ["dusk"];
  }
}

/** OB vessel symbol wrapped for rotation-center */
function makeVesselIcon(label: string, headingDeg: number) {
  const html = `
    <div class="vessel-wrap" style="transform: rotate(${headingDeg}deg);">
      <obi-vessel-generic-default-filled
        class="vessel-icon"
        aria-label="${label}"
        useCssColor="true"
        use-css-color
      ></obi-vessel-generic-default-filled>
    </div>
  `;
  return L.divIcon({
    className: "obi-vessel-divicon",
    html,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
}




export default function LeafletMap() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const baseRef = useRef<any | null>(null);

  // Preloader registry (neighbors only, created on-demand)
  const preloadersRef = useRef<Partial<Record<Theme, any>>>({});
  const isPreloadingRef = useRef<boolean>(false);

  // Debounce for theme switching via DOM attribute mutation
  const themeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

    const map = L.map(hostRef.current, {
      attributionControl: false,
      zoomControl: false,
    });
    mapRef.current = map;

    const html = document.documentElement;
    const getTheme = () => (html.getAttribute("data-obc-theme") || "day") as Theme;

    // --- Base layer (single TileLayer, switched via setUrl) ---
    const initialTheme = getTheme();
    const baseCfg = tileConfigFor(initialTheme);

    const base = L.tileLayer(baseCfg.url, {
      attribution: baseCfg.attribution,
      maxZoom: baseCfg.maxZoom,
      detectRetina: baseCfg.detectRetina,
      // Quality-of-life settings (optional)
      keepBuffer: 2,
      updateWhenIdle: true,
    }).addTo(map);
    base.setOpacity(opacityFor(initialTheme));
    baseRef.current = base;

    // --- Demo vessels using OB icon with provided headings ---
    type Vessel = { name: string; lat: number; lon: number; heading: number };
    const vessels: Vessel[] = [
      { name: "A3601", lat: 55.0,  lon: -35.0, heading: 317 },
      { name: "A3602", lat: 50.5,  lon: -20.0, heading: 142 },
      { name: "A3603", lat: 60.0,  lon:  -8.0, heading:  28 },
      { name: "A3604", lat: 48.0,  lon: -45.0, heading: 203 },
      { name: "A3605", lat: 58.96, lon:  -8.18, heading:  81 },
    ];

    const markers = vessels.map((v) =>
      L.marker([v.lat, v.lon], { icon: makeVesselIcon(v.name, v.heading) })
        .addTo(map)
        .bindPopup(v.name)
    );

    if (markers.length) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.2));
    }

    // ---------- Preloader helpers (neighbors only, current zoom only) ----------
    const ALL: Theme[] = ["bright", "day", "dusk", "night"];

    /** Create or refresh an invisible preloader for theme `t` at exact zoom `z`. */
    const ensurePreloaderAtZoom = (t: Theme, z: number) => {
      const cfg = tileConfigFor(t);
      let pre = preloadersRef.current[t];

      if (pre) {
        // Refresh URL & clamp to this zoom only
        pre.setUrl(cfg.url, false);
        pre.options.minZoom = z;
        pre.options.maxZoom = z;
        pre.redraw?.();
        return pre;
      }

      pre = L.tileLayer(cfg.url, {
        attribution: cfg.attribution,
        detectRetina: cfg.detectRetina,
        // Restrict to current zoom ONLY
        minZoom: z,
        maxZoom: z,
        // Keep bandwidth modest for the preloader
        keepBuffer: 0,
        updateWhenIdle: true,
        updateWhenZooming: false,
        interactive: false,
      })
        .addTo(map)
        .setOpacity(0);

      preloadersRef.current[t] = pre;
      pre.redraw?.();
      return pre;
    };

    const removePreloader = (t: Theme) => {
      const pre = preloadersRef.current[t];
      if (pre) {
        map.removeLayer(pre);
        delete preloadersRef.current[t];
      }
    };

    const removeAllPreloaders = () => {
      ALL.forEach(removePreloader);
    };

    /** Start preloading nearest neighbors at the current zoom. */
    const startPreloadingNeighbors = () => {
      isPreloadingRef.current = true;
      const theme = getTheme();
      const z = map.getZoom();
      const neighbors = neighborsFor(theme);

      // Add/refresh neighbors at current zoom, remove non-neighbors
      neighbors.forEach((t) => ensurePreloaderAtZoom(t, z));
      ALL.forEach((t) => {
        if (!neighbors.includes(t)) removePreloader(t);
      });
    };

    /** Stop preloading and remove neighbor layers. */
    const stopPreloadingNeighbors = () => {
      isPreloadingRef.current = false;
      removeAllPreloaders();
    };

    // Wire to global events (dispatch from your Brilliance menu)
    const onOpen = () => startPreloadingNeighbors();
    const onClose = () => stopPreloadingNeighbors();
    window.addEventListener("brilliance:open", onOpen);
    window.addEventListener("brilliance:close", onClose);

    // ---------- Theme switching (Option A: setUrl + setOpacity) ----------

    const applyTheme = () => {
      const theme = getTheme();
      const nextCfg = tileConfigFor(theme);

      const baseLayer = baseRef.current;
      if (!baseLayer) return;

      baseLayer.setUrl(nextCfg.url, false);
      baseLayer.setOpacity(opacityFor(theme));

      // While menu is open, rotate preloaders to new neighbors at current zoom
      if (isPreloadingRef.current) {
        startPreloadingNeighbors();
      }

      map.invalidateSize({ pan: false, animate: false });
    };

    // Debounce attribute-triggered theme changes on <html data-obc-theme="...">
    const scheduleApplyTheme = () => {
      if (themeTimerRef.current) window.clearTimeout(themeTimerRef.current);
      themeTimerRef.current = window.setTimeout(applyTheme, 80) as unknown as number;
    };

    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "attributes" && m.attributeName === "data-obc-theme") {
          scheduleApplyTheme();
        }
      }
    });
    mo.observe(html, { attributes: true, attributeFilter: ["data-obc-theme"] });

    // Cleanup
    return () => {
      if (themeTimerRef.current) window.clearTimeout(themeTimerRef.current);
      window.removeEventListener("brilliance:open", onOpen);
      window.removeEventListener("brilliance:close", onClose);
      mo.disconnect();
      removeAllPreloaders();
      map.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}