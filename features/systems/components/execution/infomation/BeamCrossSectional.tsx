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
  return (
    <svg width="220" height="220">
      {rx === ry ? (
        <circle
          cx={cx}
          cy={cy}
          r={rx}
          fill="#f2f3f4"
          strokeWidth={1.5}
          stroke="black"
        />
      ) : (
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="#f2f3f4"
          strokeWidth={1.5}
          stroke="black"
        />
      )}
    </svg>
  );
};

export default BeamCrossSectional;
