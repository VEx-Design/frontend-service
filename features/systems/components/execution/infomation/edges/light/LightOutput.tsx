import React from "react";
import approximateConstant from "../../../libs/approximateConstant";
import SymbolDisplay from "@/components/SymbolDisplay";

interface LightOutputProps {
  symbol: string;
  value: number;
}

export default function LightOutput({ symbol, value }: LightOutputProps) {
  return (
    <div className="flex items-center bg-gray-100 rounded-full gap-2">
      <div className="flex items-center justify-center bg-C1 !text-white rounded-full py-1 px-2">
        <SymbolDisplay symbol={symbol} />
      </div>
      <div>{approximateConstant(value)}</div>
    </div>
  );
}
