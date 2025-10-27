import { ObcAzimuthThruster } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/navigation-instruments/azimuth-thruster/azimuth-thruster";
import { ObcSlider } from "@ocean-industries-concept-lab/openbridge-webcomponents-react/components/slider/slider";
import { useState } from "react";

export function InstrumentDemo() {
  const [azimuth, setAzimuth] = useState(0);

  const handleAzimuthChange = (e: CustomEvent) => {
    setAzimuth(e.detail);
  };

  return (
    <>
      <ObcSlider min={0} max={360} onValue={handleAzimuthChange} />
      <ObcAzimuthThruster angle={azimuth} />
    </>
  );
}