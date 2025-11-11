
// import React from "react";
import { ObcContextMenu } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/context-menu/context-menu";
import { ObcNavigationItem } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObiOwnShipNoCommandGeneric } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-own-ship-no-command-generic";

import "./ContextMenu.css";


// Define vessel data structure
type Vessel = {
  name: string;
  alerts: number;
  type: string;
  silenced: boolean;
};
//Vessel parameters, consider moving to a separate data file
export const vessels: Vessel[] = [
  { name: "A3601", alerts: 3, type: "alarm",    silenced: false },
  { name: "A3602", alerts: 1, type: "warning",  silenced: false },
  { name: "A3603", alerts: 0, type: "",         silenced: true  },
  { name: "A3604", alerts: 1, type: "alarm",    silenced: true  },
  { name: "A3605", alerts: 0, type: "",         silenced: false },
];



// Create menu with vessels
export function ContextMenu({ ...delegated }) {
  // Example vessel labels, get from ShipID
  const items = ["A3601", "A3602", "A3603", "A3604", "A3605"];
  return (
    <ObcContextMenu {...delegated}>
      {items.map((label) => {
      // Just as an example: derive a last char from labels
        const lastChar = label[label.length - 1];
        return (
          <div key={label} className="context-menu-item">
          <ObcNavigationItem key={label} label={label} hasIcon={true}>
            {/* Wrap both icon and overlay text in a single slotted container */}
            <div slot="icon" className="icon-stack">
              <ObiOwnShipNoCommandGeneric
                className="icon-base"
                useCssColor={true}
              />
              <span className="icon-text">{lastChar}</span>
            </div>
          </ObcNavigationItem>
          {/*<ObcAlertButton
            nAlerts={3}
            alertType="alarm"
            type="normal"
            counter
            blinking
            alertLabel="Alert"
            silenceLabel="Silence"
              onClickAlert={() => {
                console.log(`Alert clicked for ${label}`);
              }}
              onClickSilence={() => {
                console.log(`Silence clicked for ${label}`);
              }}
            ></ObcAlertButton>*/}
          </div>
        );
      })}
    </ObcContextMenu>
  );
}
