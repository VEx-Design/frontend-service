import React from "react";
interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input(props: InputProps) {
  return (
    <div>
      <p className="text-sm font-semibold">{props.label}</p>
      <input
        className="border border-editbar-border rounded-md p-1 bg-white text-sm w-full"
        type="text"
        value={props.value}
        placeholder={props.placeholder}
        onChange={props.onChange}
      />
    </div>
  );
}
