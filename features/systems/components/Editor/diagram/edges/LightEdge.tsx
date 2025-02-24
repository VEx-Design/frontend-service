import React, { useMemo } from "react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "@xyflow/react";
import { useEditor } from "@/features/systems/contexts/EditorContext";
import { EdgeData } from "@/features/systems/libs/ClassEdge/types/AppEdge";

export default function LightEdge(props: EdgeProps) {
  const edgeData = props.data?.data as EdgeData;

  const [edgePath, labelX, labelY] = getBezierPath(props);
  const { setEdges } = useReactFlow();

  const { focusEdge } = useEditor();

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
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <button
            className="w-5 h-5 border cursor-pointer bg-white rounded-full text-xs leading-none hover:shadow-lg"
            onClick={() => {
              setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
            }}
          >
            x
          </button>
        </div>
      </EdgeLabelRenderer>
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${
              labelY - 24
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
