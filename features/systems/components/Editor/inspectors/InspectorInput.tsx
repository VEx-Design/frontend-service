import React, { ChangeEvent } from "react";

interface InputProps {
  title: string;
  placeholder?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
}

function Input(props: InputProps) {
  return (
    <div>
      <div className="text-sm">{props.title}</div>
      <div className="flex items-center gap-2">
        <input
          type={props.type}
          id="name"
          className="border-2 border-editbar-border rounded-md p-1 bg-white text-sm w-full"
          placeholder={props.placeholder}
          value={props.value}
          onChange={props.onChange}
          disabled={props.disabled}
        />
        <p>mm</p>
        {/* mrad */}
      </div>
    </div>
  );
}

export default Input;
