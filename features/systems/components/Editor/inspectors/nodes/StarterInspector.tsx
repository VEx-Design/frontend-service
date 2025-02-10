import React from "react";
import Input from "../InspectorInput";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import { useEditor } from "@/features/systems/contexts/EditorContext";
import getInitial from "@/features/systems/libs/ClassNode/getInitial";

export default function StarterInspector() {
  const { config } = useProject();
  const { focusNode, nodeAction } = useEditor();

  if (!focusNode) return null;

  return (
    <div className="flex flex-col pt-5 gap-2 px-6">
      {config.parameters.map((param, index) => (
        <Input
          type="number"
          key={index}
          title={`${param.name} [${param.symbol}]`}
          value={getInitial(focusNode.data, param.id).toString()}
          onChange={(e) => {
            nodeAction.setInitial(param.id, parseFloat(e.target.value));
          }}
        />
      ))}
    </div>
  );
}
