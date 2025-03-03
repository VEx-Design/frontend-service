import React, { useMemo, useCallback } from "react";
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
  const { setEdges } = useReactFlow();
  const { focusEdge } = useEditor();

  // Memoize edge path calculation
  const [edgePath, labelX, labelY] = useMemo(
    () => getBezierPath(props),
    [props]
  );

  // Memoize selection state
  const selected = useMemo(
    () => focusEdge?.id === props.id,
    [focusEdge?.id, props.id]
  );

  const edgeStyle = selected
    ? { stroke: "#000", strokeWidth: 3 }
    : { stroke: "#000", strokeWidth: 1 };

  // Memoized removeEdge function
  const removeEdge = useCallback(() => {
    setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
  }, [setEdges, props.id]);

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={props.markerEnd} style={edgeStyle} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Distance Label */}
          <div className="text-sm font-semibold mb-1">
            {`${edgeData?.distance ?? "Edge Label"} mm`}
          </div>

          {/* Delete Button */}
          <button
            className="w-5 h-5 border cursor-pointer bg-white rounded-full text-xs leading-none hover:shadow-lg"
            onClick={removeEdge}
          >
            x
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
