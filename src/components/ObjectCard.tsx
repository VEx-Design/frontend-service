/* eslint-disable @next/next/no-img-element */
import React from "react";

interface ObjectCardProps {
  name: string;
  parameter: Record<string, string | number>;
}

function ObjectCard({ name, parameter }: ObjectCardProps) {
  const parameterEntries = Object.entries(parameter);
  // console.log(parameterEntries);

  return (
    <div className="bg-white w-[160px] rounded-lg border-2 border-B1 shadow-sm mt-4 hover:shadow-md">
      <div className="flex-col items-center bg-B1 rounded-t-lg px-2 py-3 h-14 text-xs relative">
        <img
          src="https://plus.unsplash.com/premium_photo-1733230677536-ebd9121658ce?q=80&w=1375&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="objectimage"
          className="w-12 h-12 object-cover rounded-full absolute -right-1 -top-4 border-4 border-B1 "
        />
        <p className="line-clamp-2 w-28">{name}</p>
      </div>
      <div className="h-32 p-2 text-[10px] text-gray-600">
        <ul>
          {parameterEntries.map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ObjectCard;
