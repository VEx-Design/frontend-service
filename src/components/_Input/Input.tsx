import React from "react";

interface InputProps {
  title: string;
  placeholder: string;
  type: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  hasError?: boolean;
}

function Input({
  title,
  placeholder,
  type,
  onChange,
  errorMessage,
  hasError,
}: InputProps) {
  return (
    <div
      className={`flex flex-col gap-3 ${
        hasError ? "border-l-2 border-red-500 pl-4" : ""
      }`}
    >
      <label htmlFor={`${title}`}>{title}</label>
      <input
        type={type}
        id={`${title}`}
        className={`rounded-md p-2 ${
          hasError ? "border-2 border-red-500 placeholder-red-500" : "border-2"
        }`}
        placeholder={placeholder}
        onChange={onChange}
      />
      {errorMessage && (
        <span className="text-xs text-red-500">{errorMessage}</span>
      )}
    </div>
  );
}

export default Input;
