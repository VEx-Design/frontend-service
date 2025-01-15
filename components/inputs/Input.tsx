import React from "react";
import InputProps from "./InputProps";

function Input(props: InputProps) {
  return (
    <div className="flex flex-col gap-3">
      <input
        {...props.field}
        type={props.type}
        className={`border-2 rounded-md p-2 ${props.className}`}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
}

export default Input;
