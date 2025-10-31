import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ObcTopBar } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/top-bar/top-bar";
import { ObcBrillianceMenu } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/brilliance-menu/brilliance-menu";
import { ObcPalette } from "@ocean-industries-concept-lab/openbridge-webcomponents/dist/components/brilliance-menu/brilliance-menu";
import { ObcClock } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/clock/clock.js";

import "./App.css";
import { NavigationMenu } from "./components/NavigationMenu";
import { ContextMenu } from "./components/ContextMenu";
// import LeafletMap from "./components/LeafletMap";
import MapLibreMap from "./components/MapLibre-local"; // Using local version with local styles
import useMinuteUpdate from "./hooks/useMinuteUpdate";
type Palette = ObcPalette;

/** Read initial palette from the DOM attribute if present, else default to 'day' */
const getInitialPalette = (): Palette => {
  const fromAttr = document.documentElement.getAttribute("data-obc-theme");
  const v = (fromAttr ?? "day").toLowerCase();
  return (["day", "dusk", "night", "bright"] as const).includes(v as Palette)
    ? (v as Palette)
    : ("day" as Palette);
};

const getLogoSrc = (p: Palette) => `/has-logo-${p}.svg`; // Update logoSrc with current palette

export default function App() {
  const [showBrillianceMenu, setShowBrillianceMenu] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [palette, setPalette] = useState<Palette>(getInitialPalette);

  const brillianceRef = useRef<any>(null);
  const time = useMinuteUpdate();

  /** Keep OpenBridge theming attribute in sync with React state */
  useEffect(() => {
    document.documentElement.setAttribute("data-obc-theme", palette);
  }, [palette]);

  /** Keep the Brilliance menu selection in sync so it opens showing the current palette */
  useEffect(() => {
    const el = brillianceRef.current;
    if (!el) return;

    // Try both property & attribute to cover the web component API
    // (Some WC use a property `palette`, others might use `value`.)
    el.palette = palette;
    el.setAttribute("palette", palette);
    el.value = palette;
    el.setAttribute("value", palette);
  }, [palette, showBrillianceMenu]);

  /** Handler from the Brilliance menu */
  const handleBrillianceChange = useCallback((e: CustomEvent) => {
    const next = String(e.detail?.value || "day").toLowerCase() as Palette;
    const normalized: Palette = (["day", "dusk", "night", "bright"] as const).includes(next)
      ? next
      : ("day" as Palette);
    setPalette(normalized); // this also updates data-obc-theme via effect
  }, []);

  /** Compute the current logo path and pass to NavigationMenu */
  const logoSrc = useMemo(() => getLogoSrc(palette), [palette]);

  /* Dimming/palette button handler */
  const handleDimmingButtonClicked = () => {
    setShowBrillianceMenu(!showBrillianceMenu);
    setShowNavigationMenu(false);
  };

  /** Navigation menu button handler */
  const handleNavigationButtonClicked = () => {
    setShowNavigationMenu(!showNavigationMenu);
    setShowBrillianceMenu(false);
  };

  /* Build the page */
  return (
    <>
      <header>
        <ObcTopBar
          className="topbar"
          showClock
          showDimmingButton
          appTitle="Høglund"
          pageName="Fleet Overview"
          dimmingButtonActivated={showBrillianceMenu}
          onDimmingButtonClicked={handleDimmingButtonClicked}
          menuButtonActivated={showNavigationMenu}
          onMenuButtonClicked={handleNavigationButtonClicked}
        >
          <ObcClock date={time} slot="clock" />
        </ObcTopBar>
      </header>

      <main className="app-main">
        
        {/* Vessel list/menu */}
          <ContextMenu className="context-menu" />

        {/* The map fills the content area */}
           {/*<LeafletMap/> */}
          <MapLibreMap palette={palette} />
        {/* Overlays */}
        {showNavigationMenu && (
          <NavigationMenu className="navigation-menu" logoSrc={logoSrc} />
        )}

        {showBrillianceMenu && (
          <ObcBrillianceMenu
            ref={brillianceRef}
            className="brilliance"
            palette={palette}
            onPaletteChanged={handleBrillianceChange}
            hideBrightness
          />
        )}
      </main>
    </>
  );
}