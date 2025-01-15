import React, { useContext } from "react";
import { PyramidIcon } from "lucide-react";
import Input from "../Input";
import { editObjectValueById } from "../../libs/editObjectDetail";
import { EditorContext } from "../Editor";

export default function InspectorBar() {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }
  const { focusNode, setFocusNode } = context;

  return (
    <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 overflow-y-auto">
      <header className="text-center text-lg font-semibold border-b-1 border-editbar-border pb-4">
        Properties
      </header>
      <div className="flex flex-col pt-5 gap-2 px-6">
        <div className="flex items-center gap-1">
          <PyramidIcon className="stroke-editbar-border" size={30} />
          <input
            id="name"
            className="border-2 border-editbar-border rounded-md p-1 bg-white text-sm w-full"
            placeholder="Enter object name"
            value="Lens 1"
          />
        </div>
        <div className="flex bg-slate-100 p-1 justify-center rounded-lg text-sm">
          {focusNode?.data.object?.name}
        </div>
      </div>
      <div className="flex flex-col pt-5 gap-2 px-6">
        {focusNode?.data.object &&
          focusNode.data.object.vars.map((variable, index) => (
            <Input
              type="number"
              key={index}
              title={`${variable.name} [${variable.symbol}]`}
              value={`${variable.value}`}
              onChange={(e) => {
                setFocusNode({
                  ...focusNode,
                  data: editObjectValueById(
                    variable.id,
                    e.target.value,
                    focusNode.data
                  ),
                });
              }}
            />
          ))}
      </div>
    </div>
  );
}
