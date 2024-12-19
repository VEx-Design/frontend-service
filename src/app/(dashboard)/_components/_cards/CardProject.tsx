import React from "react";
import { GoKebabHorizontal } from "react-icons/go";

interface CardProjectProps {
  project_name: string;
  owner: string;
  time_recent_access: string;
  image_url: string;
  can_edit: boolean;
}

function CardProject({
  project_name,
  owner,
  time_recent_access,
  image_url,
  can_edit,
}: CardProjectProps) {
  return (
    <div className="w-full sm:min-w-[230px] h-[300px] rounded-xl hover:bg-B1 transition">
      <div className="relative bg-gray-400 h-[230px] rounded-lg overflow-hidden">
        <img
          src={image_url}
          alt="coverimages"
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 left-2 px-3 py-1 text-white rounded-lg text-xs ${
            can_edit ? "bg-C1" : "bg-gray-400"
          }`}
        >
          {can_edit ? "Can Edit" : "View Only"}
        </span>
        <div className="absolute top-3 right-4">
          <GoKebabHorizontal />
        </div>
      </div>
      <div className="p-1 h-[70px] w-full overflow-hidden flex items-center">
        <div className="flex-1 flex flex-col gap-1">
          <span className="text-sm font-semibold">{project_name}</span>
          <div className="text-[10px] flex flex-col justify-between whitespace-nowrap text-gray-400">
            <span className="truncate">by {owner}</span>
            <span className="truncate">{time_recent_access}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardProject;
