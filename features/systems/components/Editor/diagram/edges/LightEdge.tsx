import React, { useMemo, useState } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { useEditor } from "@/features/systems/contexts/EditorContext";
import { EdgeData } from "@/features/systems/libs/ClassEdge/types/AppEdge";
import { cn } from "@/lib/utils";

export default function LightEdge(props: EdgeProps) {
  const edgeData = props.data?.data as EdgeData;
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  const [edgePath, labelX, labelY] = getBezierPath(props);
  const { setEdges } = useReactFlow();
  const { focusEdge } = useEditor();

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

      {/* Delete Button */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <button
            className="w-5 h-5 border cursor-pointer bg-white rounded-full text-xs leading-none hover:shadow-lg hover:bg-red-500 hover:text-white"
            onClick={() => {
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
            }}
          >
            x
          </button>
        </div>
      </EdgeLabelRenderer>

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
                ? labelX + 40
                : labelX - 40
            }px, ${
              isHorizontal
                ? positionX === "bottom"
                  ? labelY + 20
                  : labelY - 20
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
          <div className="text-sm font-semibold mb-1">
            {edgeData?.distance ? `${edgeData.distance} mm` : "Edge Label"}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
