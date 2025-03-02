import { getChild } from "@/components/libs/getChildren";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getPrefixById,
  getUnitById,
  unitPrefixes,
} from "@/features/systems/libs/UnitManagement/unit";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface OutputProps {
  title: string;
  placeholder?: string;
  value: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  id?: string;
  unitId?: string;
  prefixId?: string;
  onPrefixChange?: (prefixId: string) => void;
  children?: React.ReactNode;
}

function Output({
  title,
  placeholder,
  value,
  onChange,
  type = "text",
  disabled,
  id,
  unitId,
  prefixId,
  onPrefixChange,
  children,
}: OutputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const unit = unitId ? getUnitById(unitId) : null;
  const selectedPrefix = prefixId ? getPrefixById(prefixId) : null;

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

  const label = useMemo(() => getChild(children, OutputLabel), [children]);
  console.log("label", label);

  return (
    <div className="flex flex-col">
      {label ? (
        <div>{label}</div>
      ) : (
        <label htmlFor={id} className="text-sm font-semibold">
          {title}
        </label>
      )}
      <div className="flex items-center border-2 border-editbar-border rounded-md bg-gray-100 text-sm">
        <input
          type={type}
          id={id}
          className="p-1 focus:outline-none w-full rounded-md"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
        {unit &&
          !("isCompound" in unit) && ( // Check if it's a simple unit
            <div
              className="relative flex px-1 ms-1 bg-gray-100"
              ref={dropdownRef}
            >
              <div
                className="flex items-center cursor-pointer"
                onClick={() => unit.havePrefix && setIsOpen(!isOpen)}
              >
                <p>
                  {`${unit.havePrefix ? selectedPrefix?.symbol ?? "" : ""}${
                    unit.symbol
                  }`}
                </p>
                {unit.havePrefix &&
                  (isOpen ? (
                    <ChevronUp size={10} />
                  ) : (
                    <ChevronDown size={10} />
                  ))}
              </div>
              {isOpen && unit.havePrefix && (
                <div className="absolute min-w-max right-0 top-6 bg-white border-2 rounded-md shadow-sm z-10">
                  <ScrollArea>
                    {unitPrefixes.map((prefix) => (
                      <div
                        key={prefix.id}
                        className="max-h-32 px-2 py-1 hover:bg-gray-100 rounded-md cursor-pointer"
                        onClick={() => {
                          onPrefixChange?.(prefix.id); // Call handler when a prefix is selected
                          setIsOpen(false);
                        }}
                      >
                        {`${prefix.symbol}${unit.symbol}`}
                      </div>
                    ))}
                  </ScrollArea>
                </div>
              )}
            </div>
          )}
      </div>
    </div>
  );
}

export function OutputLabel({ children }: { children: React.ReactNode }) {
  return <div className="flex">{children}</div>;
}

export default Output;
