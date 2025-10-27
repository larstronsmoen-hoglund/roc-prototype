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

export function NavigationMenu({ ...delegated }) {
  return (
    <ObcNavigationMenu {...delegated}>
      <ObcNavigationItem slot="main" label="Apps" href="Apps">
        <ObiApplications slot="icon"></ObiApplications>
      </ObcNavigationItem>
      <ObcNavigationItem slot="main" checked label="Alerts" href="Alerts">
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
      <ObcVendorButton imageSrc="/has-logo-day.svg" alt="Høglund" slot="logo">
      </ObcVendorButton>
    </ObcNavigationMenu>
  );
}