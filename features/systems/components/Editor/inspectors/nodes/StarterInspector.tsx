import React from "react";
import Input from "../InspectorInput";
import { useProject } from "@/features/systems/contexts/ProjectContext";
import { useEditor } from "@/features/systems/contexts/EditorContext";
import getInitial from "@/features/systems/libs/ClassNode/getInitial";
import { CircleFadingPlus } from "lucide-react";

export default function StarterInspector() {
  const { config } = useProject();
  const { focusNode, nodeAction } = useEditor();

  if (!focusNode) return null;

  return (
    <div className="flex flex-col pt-5 gap-4 px-6">
      {(focusNode.data.initials ?? []).map((light, index) => (
        <div key={light.id}>
          <div className="flex flex-1 items-center">
            <p className="text-sm font-semibold">{`Light ${index + 1}`}</p>
          </div>
          <div className="flex flex-col gap-2">
            {config.parameters.map((param, index) => (
              <Input
                type="number"
                key={`${light.id} + ${index}`}
                title={`${param.name} [${param.symbol}]`}
                value={getInitial(
                  focusNode.data,
                  light.id,
                  param.id
                ).toString()}
                onChange={(e) => {
                  nodeAction.setInitial(
                    light.id,
                    param.id,
                    parseFloat(e.target.value)
                  );
                }}
              />
            ))}
          </div>
        </div>
      ))}
      <button
        className="flex items-center justify-center py-1 border border-C1 rounded-lg hover:bg-C1 hover:text-white mt-2"
        onClick={nodeAction.addInitialLight}
      >
        <div className="flex items-center gap-1">
          <CircleFadingPlus size={14} />
          <p className="text-sm">Add Light</p>
        </div>
      </button>
    </div>
  );
}
