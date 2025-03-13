import React from "react";

interface BeamCrossSectionalProps {
  rx: number;
  ry: number;
  cx?: number;
  cy?: number;
}

const BeamCrossSectional: React.FC<BeamCrossSectionalProps> = ({
  rx,
  ry,
  cx = 110,
  cy = 110,
}) => {
  // Ensure rx and ry are valid numbers
  const safeRx = Number.isFinite(rx) ? rx : 50;
  const safeRy = Number.isFinite(ry) ? ry : 50;

  if (!Number.isFinite(rx) || !Number.isFinite(ry)) {
    console.warn("Invalid rx or ry value in BeamCrossSectional:", { rx, ry });
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 220 220"
      preserveAspectRatio="xMidYMid meet"
    >
      {safeRx === safeRy ? (
        <circle
          cx={cx}
          cy={cy}
          r={safeRx}
          fill="#f2f3f4"
          strokeWidth={1.5}
          stroke="black"
        />
      ) : (
        <ellipse
          cx={cx}
          cy={cy}
          rx={safeRx}
          ry={safeRy}
          fill="#f2f3f4"
          strokeWidth={1.5}
          stroke="black"
        />
      )}
    </svg>
  );
};

export default BeamCrossSectional;
