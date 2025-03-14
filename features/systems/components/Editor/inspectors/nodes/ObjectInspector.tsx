import React from "react";
import { PyramidIcon, RotateCw } from "lucide-react";
import Input, { InputLabel } from "../InspectorInput";

import { useEditor } from "@/features/systems/contexts/EditorContext";
import { Property } from "@/features/systems/libs/ClassType/types/Type";
import getValue from "@/features/systems/libs/ClassObject/getValue";
import { getVarPrefixId } from "@/features/systems/libs/ClassObject/getPrefixId";
import { useConfig } from "@/features/systems/contexts/ProjectWrapper/ConfigContext";
import SymbolDisplay from "@/components/SymbolDisplay";

export default function ObjectInspector() {
  const { focusNode, nodeAction } = useEditor();
  const object = focusNode?.data?.object;

  const { configAction } = useConfig();
  const objectType = configAction.getType(object?.typeId || "");

  return (
    <>
      {object ? (
        <>
          <div className="flex flex-col pt-5 gap-2 px-6">
            <div className="flex items-center gap-1">
              <PyramidIcon className="stroke-editbar-border" size={30} />
              <input
                id="name"
                className="border-2 border-editbar-border rounded-md p-1 bg-white text-sm w-full"
                placeholder="Enter object name"
                value={object?.name || ""}
                onChange={() => {}}
              />
            </div>
            <div className="flex bg-slate-100 p-1 justify-center rounded-lg text-sm">
              {objectType?.name}
            </div>
          </div>
          <div className="flex flex-col justify-center pt-5 gap-2 px-6">
            <button
              className="bg-gray-500 p-1 rounded-lg text-sm text-white flex items-center justify-center gap-1"
              onClick={() => {
                nodeAction.rotate();
              }}
            >
              <RotateCw className="stroke-white" size={18} />
              <p>Rotate 90°</p>
            </button>
          </div>
          <div className="flex flex-col pt-5 gap-2 px-6">
            {objectType?.properties.map((prop: Property, index: number) => (
              <Input
                type="number"
                key={index}
                title={`${prop.name} (${prop.symbol})`}
                value={getValue(focusNode.data, prop.id).toString()}
                onChange={(e) => {
                  if (prop.unitId === "DEGREE") {
                    nodeAction.setValue(
                      prop.id,
                      (parseFloat(e.target.value) * Math.PI) / 180,
                      e.target.value
                    );
                  } else {
                    nodeAction.setValue(
                      prop.id,
                      parseFloat(e.target.value),
                      e.target.value
                    );
                  }
                }}
                unitId={prop.unitId}
                prefixId={getVarPrefixId(focusNode.data, prop.id)}
              >
                <InputLabel>
                  <div className="flex items-center">
                    <SymbolDisplay symbol={prop.symbol} />
                    <p className="text-sm ms-1">{` : ${prop.name}`}</p>
                  </div>
                </InputLabel>
              </Input>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center pt-4">
          <p className="text-xs text-center text-gray-500">
            No object available for the selected node.
          </p>
        </div>
      )}
    </>
  );
}
