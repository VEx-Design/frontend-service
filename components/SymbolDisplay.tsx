import React from "react";

interface SymbolDisplayProps {
  symbol: string;
}

export default function SymbolDisplay({ symbol }: SymbolDisplayProps) {
  const result: string[] = symbol.split("_", 2);
  const symbolMain = result[0];
  const symbolSub = result[1] || ""; // Fallback to an empty string if no sub-symbol exists

  return (
    <div className="flex items-end">
      <p className="font-bold">{symbolMain}</p>
      {symbolSub && <p className="text-xs font-bold">{symbolSub}</p>}{" "}
    </div>
  );
}
