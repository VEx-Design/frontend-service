import React, { useMemo, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { EdgeData } from "@/features/systems/libs/ClassEdge/types/AppEdge";
import { cn } from "@/lib/utils";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";
import PathColor from "../../../_components/PathColor";

export default function LightEdge(props: EdgeProps) {
  const edgeData = props.data?.data as EdgeData;
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const [edgePath, labelX, labelY] = getBezierPath(props);
  const { focusEdge } = useExecution();

  const selected = useMemo(
    () => focusEdge?.id === props.id,
    [focusEdge, props.id]
  );

  // Edge color logic
  const edgeStyle = useMemo(() => {
    if (selected) return { stroke: "#38bdf8", strokeWidth: 4 };
    return isHovered
      ? { stroke: "#38bdf8", strokeWidth: 2 }
      : { stroke: "#000", strokeWidth: 1 };
  }, [selected, isHovered]);

  const { targetX, targetY, sourceX, sourceY } = props;
  const isHorizontal =
    Math.abs(targetX - sourceX) > Math.abs(targetY - sourceY);
  const positionX = targetX > sourceX ? "bottom" : "top";
  const positionY = targetY > sourceY ? "right" : "left";
  const offsetX = (edgeData.lights?.length ?? 0) > 0 ? 50 : 35;
  const offsetY = (edgeData.lights?.length ?? 0) > 0 ? 30 : 15;

  return (
    <>
      <g
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Invisible Path for Hover Detection */}
        <path
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={12} // Bigger stroke width improves hover detection
        />
        {/* Actual Edge */}
        <BaseEdge
          path={edgePath}
          markerEnd={props.markerEnd}
          style={edgeStyle}
        />
      </g>
      {/* Edge Label */}
      <EdgeLabelRenderer>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${
              isHorizontal
                ? labelX
                : positionY === "left"
                ? labelX + offsetX
                : labelX - offsetX
            }px, ${
              isHorizontal
                ? positionX === "bottom"
                  ? labelY + offsetY
                  : labelY - offsetY
                : labelY
            }px)`,
            pointerEvents: "all",
          }}
          className={cn(
            "cursor-pointer",
            isHovered && "text-sky-400",
            selected && "text-sky-400"
          )}
        >
          {positionX !== "bottom" && (
            <div className="flex justify-center items-center">
              {edgeData.lights?.map((light, index) => (
                <PathColor key={index} color={light.path.color} />
              ))}
            </div>
          )}
          <div className="text-sm font-semibold mb-1">
            {edgeData?.distance ? `${edgeData.distance} mm` : "Edge Label"}
          </div>
          {positionX === "bottom" && (
            <div className="flex justify-center items-center">
              {edgeData.lights?.map((light, index) => (
                <PathColor key={index} color={light.path.color} />
              ))}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
