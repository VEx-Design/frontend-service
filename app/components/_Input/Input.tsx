import React from "react";

interface InputProps {
  title: string;
  placeholder: string;
  type: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

function Input({ title, placeholder, type, onChange }: InputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={`${title}`}>{title}</label>
      <input
        type={type}
        id={`${title}`}
        className="border-2 rounded-md p-2 "
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
}

export default Input;
