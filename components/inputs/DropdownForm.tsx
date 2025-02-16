import React, { useEffect, useRef, useState } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface DropdownFormProps<TFormValues extends FieldValues> {
  name: Path<TFormValues>;
  options: Option[];
  control?: Control<TFormValues>;
  className?: string;
  onChange?: (value: string) => void;
}

type Option = {
  value: string;
  label?: string;
};

function DropdownForm<TFormValues extends FieldValues>({
  name,
  options,
  control,
  className,
  onChange,
}: DropdownFormProps<TFormValues>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const selectedRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-scroll to selected item
  useEffect(() => {
    if (isOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (
    option: Option,
    field: { onChange: (value: string) => void }
  ) => {
    field.onChange(option.value);
    setSelectedOption(option);
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="relative flex flex-col" ref={dropdownRef}>
          {/* Dropdown Input with Arrow */}
          <div
            className={cn(
              `border-2 rounded-md p-2 flex items-center justify-between cursor-pointer ${className} bg-white text-gray-800 ${
                isOpen && "border-black"
              }`,
              !selectedOption && "text-gray-500"
            )}
            onClick={toggleDropdown}
          >
            <span>{selectedOption?.label || "Select an option"}</span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>

          {/* Dropdown List */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-11 bg-white border-2 rounded-md shadow-sm z-10">
              <ScrollArea>
                <div style={{ maxHeight: "120px" }}>
                  {options.map((option, index) => (
                    <div
                      key={index}
                      ref={
                        selectedOption?.value === option.value
                          ? selectedRef
                          : null
                      }
                      className={cn(
                        "flex items-center",
                        "p-2 hover:bg-gray-100 cursor-pointer rounded-md",
                        selectedOption?.value === option.value && "bg-gray-200" // Highlight selected item
                      )}
                      onClick={() => handleOptionClick(option, field)}
                    >
                      {selectedOption && (
                        <Check
                          size={16}
                          strokeWidth={3}
                          className={cn(
                            "mr-1",
                            option.label === selectedOption.label
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      )}
                      <p>{option.label || option.value}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      )}
    />
  );
}

export default DropdownForm;
