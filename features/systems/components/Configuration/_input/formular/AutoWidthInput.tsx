import React, { useRef, useEffect, forwardRef } from "react";

const AutoWidthInput = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ value = "", onChange, ...props }, ref) => {
  const spanRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (spanRef.current && inputRef.current) {
      inputRef.current.style.width = `${spanRef.current.offsetWidth + 2}px`;
    }
  }, [value]);

  return (
    <div className="inline-block">
      <span ref={spanRef} className="invisible absolute text-sm p-0">
        {value || ""}
      </span>
      <input
        ref={(node) => {
          (
            inputRef as React.MutableRefObject<HTMLInputElement | null>
          ).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref && "current" in ref)
            (ref as React.MutableRefObject<HTMLInputElement | null>).current =
              node;
        }}
        type="text"
        className="outline-none focus:ring-0 focus:border-transparent text-sm p-0 bg-transparent border-none"
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
});

AutoWidthInput.displayName = "AutoWidthInput";
export default AutoWidthInput;
