import React, { useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { EdgeData } from "@/features/systems/libs/ClassEdge/types/AppEdge";
import { useExecution } from "@/features/systems/contexts/Execution/ExecutionContext";

export default function LightEdge(props: EdgeProps) {
  const edgeData = props.data?.data as EdgeData;

  const [edgePath, labelX, labelY] = getBezierPath(props);

  const { focusEdge } = useExecution();

  const selected = useMemo(
    () => focusEdge?.id === props.id,
    [focusEdge, props.id]
  );

  const edgeStyle = selected
    ? { stroke: "#000", strokeWidth: 3 }
    : { stroke: "#000", strokeWidth: 1 };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={edgeStyle} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${
              labelY - 18
            }px)`,
            pointerEvents: "all",
          }}
        >
          <div className="text-sm font-semibold mb-1">
            {`${edgeData.distance} mm` || "Edge Label"}{" "}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
