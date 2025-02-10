import { useEditor } from "@/features/systems/contexts/EditorContext";
import { useReactFlow } from "@xyflow/react";
import React from "react";
import Button from "@/components/Button";
import { TrashIcon } from "lucide-react";
import StarterInspector from "./StarterInspector";
import ObjectInspector from "./ObjectInspector";

export default function NodeInspector() {
  const { focusNode, setFocusNode } = useEditor();
  const { deleteElements } = useReactFlow();

  if (!focusNode) {
    return (
      <div className="flex flex-col items-center pt-4">
        <p className="text-xs text-center text-gray-500">
          No node is currently focused.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        {(() => {
          switch (focusNode.type) {
            case "ObjectNode":
              return <ObjectInspector />;
            case "starter":
              return <StarterInspector />;
            default:
              return (
                <div className="flex flex-col items-center pt-4">
                  <p className="text-xs text-center text-gray-500">
                    No properties available for the selected object.
                  </p>
                </div>
              );
          }
        })()}
      </div>
      <div className="flex mt-4 mx-6 justify-center items-center">
        <Button
          variant="danger"
          handleButtonClick={() => {
            deleteElements({
              nodes: [{ id: focusNode.id }],
            });
            setFocusNode(undefined);
          }}
          className="flex w-full justify-center"
        >
          <div className="flex items-center gap-1">
            <TrashIcon size={14} />
            <p className="text-sm">Delete this node</p>
          </div>
        </Button>
      </div>
    </div>
  );
}
