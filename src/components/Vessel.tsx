
// components/vessel/Vessel.tsx
import React from "react";
import "./Vessel.css";

export type VesselProps = {
  /** 0..359, 0 = up/North */
  headingDeg: number;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Optional: custom class to theme per context */
  className?: string;
};

/**
 * 64x64 OpenBridge-based vessel icon.
 * - Outer layer rotates by heading
 * - Hull (outlined) follows rotation
 * - Center index badge remains upright (counter-rotated)
 */
export function Vessel({ headingDeg, ariaLabel, className }: VesselProps) {
  const safeHeading = ((headingDeg % 360) + 360) % 360;

  return (
    <div
      className={`vessel64 ${className ?? ""}`}
      style={{ ["--hd" as any]: `${safeHeading}deg` }}
      role="img"
      aria-label={ariaLabel ?? `Vessel heading ${safeHeading} degrees`}
    >
      {/* Rotated layer */}
      <div className="rot">
        <obi-vessel-type-generic-outlined
          class="hull"
          useCssColor="true"
          use-css-color
        />
      </div>

      {/* Centered badge that stays 0deg (via counter-rotate) */}
      <div className="center-badge">
        <obi-own-ship-no-command-index
          useCssColor="true"
          use-css-color
        />
      </div>
    </div>
  );
}

export default Vessel;
