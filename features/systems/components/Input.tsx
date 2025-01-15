import React, { ChangeEvent } from "react";

interface InputProps {
  title: string;
  placeholder?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function Input(props: InputProps) {
  return (
    <div>
      <div className="text-sm">{props.title}</div>
      <input
        type={props.type}
        id="name"
        className="border-2 border-editbar-border rounded-md p-1 bg-white text-sm w-full"
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}

export default Input;
