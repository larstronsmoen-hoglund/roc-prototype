import { useEffect, useMemo, useRef, useState } from "react";
import { ObcTopBar } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/top-bar/top-bar";
import {ObcBrillianceMenu, type ObcPaletteChangeEvent, type ObcBrightnessChangeEvent} from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/brilliance-menu/brilliance-menu";
import { ObcBrillianceInputVariant, ObcPalette } from "@ocean-industries-concept-lab/openbridge-webcomponents/dist/components/brilliance-menu/brilliance-menu";
import { ObcClock } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/clock/clock.js";

//import { ObiRadarTargetTrackedSelectedIec } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-radar-target-tracked-selected-iec";

import "./App.css";
import { NavigationMenu } from "./components/NavigationMenu";
import { ContextMenu } from "./components/ContextMenu";
// import LeafletMap from "./components/LeafletMap";
import MapLibreMap from "./components/MapLibre-local"; // Using local version with local styles
import useMinuteUpdate from "./hooks/useMinuteUpdate";
//import { ObcIconButton } from "@ocean-industries-concept-lab/openbridge-webcomponents/dist/components/icon-button/icon-button";
type Palette = ObcPalette;


const getLogoSrc = (p: Palette) => `/has-logo-${p}.svg`; // Update logoSrc with current palette



export default function App() {
  const [showBrillianceMenu, setShowBrillianceMenu] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);
  const [palette, setPalette] = useState(ObcPalette.day);
  const [brightness, setBrightness] = useState(100);

  // Push brightness changes to CSS variable --brightness for use on html(global)
  useEffect(() => {
    document.documentElement.style.setProperty('--brightness', `${brightness}%`);
  }, [brightness]);


  const brillianceRef = useRef<any>(null);
  // Minutes update for clock
  const time = useMinuteUpdate();
  /** Handler from the Brilliance menu */
  const handlePalleteChange = (e: ObcPaletteChangeEvent) => {
    document.documentElement.setAttribute("data-obc-theme", e.detail.value);
    setPalette(e.detail.value);
  };

/** Handler for brightness changes */
const handleBrightnessChange = (e: ObcBrightnessChangeEvent) => {
  const rawValue = e.detail.value;
  const clampedValue = Math.max(rawValue, 5); // enforce minimum 5%
  setBrightness(clampedValue);
};

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
           {/*
          <ObcIconButton variant="normal">
            <ObiRadarTargetTrackedSelectedIec/>
            </ObcIconButton>
          */}

        {/* Overlays */}
        {showNavigationMenu && (
          <NavigationMenu className="navigation-menu" logoSrc={logoSrc} />
        )}

        {showBrillianceMenu && (
          <ObcBrillianceMenu
            ref={brillianceRef}
            className="brilliance"
            palette={palette}
            onPaletteChanged={handlePalleteChange}
            brightnessInputVariant={ObcBrillianceInputVariant.slider}
            brightness={brightness}
            brightnessMax={110} // "This one goes to 11"
            onBrightnessChanged={handleBrightnessChange}
          />
        )}
      </main>
    </>
  );
}