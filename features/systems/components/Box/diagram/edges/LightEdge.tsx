import React from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
} from "@xyflow/react";
import { EdgeData } from "@/features/systems/libs/ClassEdge/types/AppEdge";

export default function LightEdge(props: EdgeProps) {
  const edgeData = props.data?.data as EdgeData;

  const [edgePath, labelX, labelY] = getBezierPath(props);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={props.markerEnd} />
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
