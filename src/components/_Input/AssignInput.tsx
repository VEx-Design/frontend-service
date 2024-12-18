import React from "react";

interface AssignInputProps {
  variable: string;
  placeholder: string;
}

function AssignInput({ variable, placeholder }: AssignInputProps) {
  return (
    <div className="flex items-center gap-3">
      <div className=" bg-B2 p-2">{variable}</div>
      <input
        type="number"
        id={`${variable}`}
        className="border-2 rounded-md p-2 "
        placeholder={placeholder}
      />
    </div>
  );
}

export default AssignInput;
