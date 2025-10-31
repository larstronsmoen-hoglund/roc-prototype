
import React from "react";
import { ObcContextMenu } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/context-menu/context-menu";
import { ObcNavigationItem } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObiOwnShipNoCommandGeneric } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-own-ship-no-command-generic";

import "./ContextMenu.css";
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
        );
      })}
    </ObcContextMenu>
  );
}
