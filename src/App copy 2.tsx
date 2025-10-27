import { useState } from "react";
import { ObcTopBar } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/top-bar/top-bar";
import { ObcBrillianceMenu } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/brilliance-menu/brilliance-menu";
import { ObcClock } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/clock/clock.js";
import useMinuteUpdate from "./hooks/useMinuteUpdate";

import "./App.css";
import { NavigationMenu } from "./components/ContextMenu";
import LeafletMap from "./components/LeafletMap";

const handleBrillianceChange = (e: CustomEvent) => {
  document.documentElement.setAttribute("data-obc-theme", e.detail.value);
};

function App() {
  const [showBrillianceMenu, setShowBrillianceMenu] = useState(false);
  const [showNavigationMenu, setShowNavigationMenu] = useState(false);

  const time = useMinuteUpdate();

  const handleDimmingButtonClicked = () => {
    setShowBrillianceMenu(!showBrillianceMenu);
    setShowNavigationMenu(false);
  };

  const handleNavigationButtonClicked = () => {
    setShowNavigationMenu(!showNavigationMenu);
    setShowBrillianceMenu(false);
  };

  return (
    <>
      <header>
        <ObcTopBar className="topbar"
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
        {/* The map fills the content area */}
          <LeafletMap />

        {/* Overlays */}
        {showNavigationMenu && <NavigationMenu className="navigation-menu" />}

        {showBrillianceMenu && (
          <ObcBrillianceMenu
            className="brilliance"
            onPaletteChanged={handleBrillianceChange}
            hideBrightness
          />
        )}
      </main>

    </>
  );
}

export default App;