
import { useMemo } from "react";
import { ObcNavigationMenu } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/navigation-menu/navigation-menu";
import { ObcVendorButton } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/vendor-button/vendor-button";
import { ObcNavigationItem } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/navigation-item/navigation-item";
import { ObiApplications } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-applications";
import { ObiAlerts } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-alerts";
import { ObiPaletteDimming } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-palette-dimming";
import { ObiSupportGoogle } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-support-google";
import { ObiSettingsIec } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-settings-iec";
import { ObiAlertList } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/icons/icon-alert-list";
import "./NavigationMenu.css";

type NavigationMenuProps = {
  /** Full path to the correct logo for the current palette (e.g., /has-logo-day.svg) */
  logoSrc?: string;
} & Record<string, unknown>; // allow spreading delegated props




export function IconProbe() {
  return (
    <div style={{ padding: 16 }}>
      
    </div>
  );
}




export function NavigationMenu({ logoSrc, ...delegated }: NavigationMenuProps) {
  // Small fallback: if App didn't pass a logoSrc, derive it from the DOM attribute
  const derivedLogoSrc = useMemo(() => {
    if (logoSrc) return logoSrc;
    const palette = document.documentElement.getAttribute("data-obc-theme") || "day";
    return `/has-logo-${palette}.svg`; // Source path for logo images updated for palette
  }, [logoSrc]);

  return (
    <ObcNavigationMenu {...delegated}>
      <ObcNavigationItem slot="main" label="Apps" href="#" >
        <ObiApplications slot="icon"></ObiApplications>
      </ObcNavigationItem>
      <ObcNavigationItem slot="main" label="Alerts" href="#">
        <ObiAlerts slot="icon"></ObiAlerts>
      </ObcNavigationItem>
      <ObcNavigationItem slot="main" label="Dimming" href="#">
        <ObiPaletteDimming slot="icon"></ObiPaletteDimming>
      </ObcNavigationItem>
      <ObcNavigationItem slot="footer" label="Help" href="#">
        <ObiSupportGoogle slot="icon"></ObiSupportGoogle>
      </ObcNavigationItem>
      <ObcNavigationItem slot="footer" label="Settings" href="#">
        <ObiSettingsIec slot="icon"></ObiSettingsIec>
      </ObcNavigationItem>
      <ObcNavigationItem slot="footer" label="Alert" href="#">
        <ObiAlertList slot="icon"></ObiAlertList>
      </ObcNavigationItem>
      <ObcVendorButton imageSrc={derivedLogoSrc} alt="Høglund" slot="logo" />
    </ObcNavigationMenu>
  );
}



