
import React, { useMemo } from "react";
import { ObcContextMenu } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/context-menu/context-menu";
import { ObcNavigationItem } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObiOwnShipNoCommandIndex } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-own-ship-no-command-index"
import { ObiOwnShipNoCommandGeneric } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-own-ship-no-command-generic"
import { ObiAlerts } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-alerts";

import "./ContextMenu.css";

export function ContextMenu({ ...delegated }) {
  return (
    <ObcContextMenu {...delegated}>
      <ObcNavigationItem label="A3601" hasIcon={true}>
        <ObiOwnShipNoCommandIndex slot="icon" ></ObiOwnShipNoCommandIndex>
      </ObcNavigationItem>
      <ObcNavigationItem label="A3602" hasIcon={true}>
        <ObiOwnShipNoCommandIndex slot="icon" ></ObiOwnShipNoCommandIndex>
      </ObcNavigationItem>
      <ObcNavigationItem label="A3603" hasIcon={true}>
        <ObiOwnShipNoCommandIndex slot="icon" ></ObiOwnShipNoCommandIndex>
      </ObcNavigationItem>
      <ObcNavigationItem label="A3604" hasIcon={true}>
        <ObiOwnShipNoCommandIndex slot="icon" ></ObiOwnShipNoCommandIndex>
      </ObcNavigationItem>
      <ObcNavigationItem label="A3605" hasIcon={true}>
        <ObiOwnShipNoCommandIndex slot="icon" ></ObiOwnShipNoCommandIndex>
      </ObcNavigationItem>

    </ObcContextMenu>

  );
}



