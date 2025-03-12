import React from "react";
import Input from "../InspectorInput";
import { useEditor } from "@/features/systems/contexts/EditorContext";

export default function EdgeInspector() {
  const { focusEdge, edgeAction } = useEditor();
  return (
    <div className="flex flex-col pt-2 gap-2 px-6">
      <Input
        type="number"
        title={`distance`}
        value={focusEdge?.data?.distance?.toString() || ""}
        onChange={(e) => {
          edgeAction.setDistance(parseFloat(e.target.value));
        }}
      />
    </div>
  );
}
