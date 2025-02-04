import { Plus } from "lucide-react";
import React from "react";

export default function PropertiesLister() {
  return (
    <div className="ms-6">
      <p className="text-sm font-semibold mb-3">Properties</p>
      <button className="w-full flex flex-1 bg-white border-2 border-gray-300 border-dashed rounded-xl justify-center items-center py-3">
        <Plus size={16} color="gray" />
      </button>
    </div>
  );
}
