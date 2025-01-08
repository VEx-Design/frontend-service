import React, { useCallback, useState } from "react";
import { ObjectNode } from "../types/object";
import { PyramidIcon } from "lucide-react";
import Input from "./Input";

interface Props {
  data: ObjectNode;
  updateData: (newData: ObjectNode) => void;
}

export default function InspectorBar(props: Props) {
  const [name, setName] = useState(props.data.name);

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedName = e.target.value;
      setName(updatedName);
      if (props.data.name) {
        props.updateData({ ...props.data, name: updatedName });
      }
    },
    [props]
  );

  const handleVarChange = useCallback(
    (index: number, value: number) => {
      const updatedVars = [...props.data.type.vars];
      updatedVars[index].value = value;
      props.updateData({
        ...props.data,
        type: { ...props.data.type, vars: updatedVars },
      });
    },
    [props]
  );

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
            value={name}
            onChange={handleNameChange}
          />
        </div>
        <div className="flex bg-slate-100 p-1 justify-center rounded-lg text-sm">
          {props.data.type.name}
        </div>
      </div>
      <div className="flex flex-col pt-5 gap-2 px-6">
        {props.data.type.vars.map((variable, index) => (
          <Input
            key={index}
            title={variable.name} // Display variable's name
            value={`${variable.value}`}
            onChange={(e) => handleVarChange(index, +e.target.value)} // Update value for the variable
          />
        ))}
      </div>
    </div>
  );
}
