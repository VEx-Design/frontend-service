import React from "react";

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
    <div className="w-full sm:min-w-[230px] h-[300px] rounded-xl hover:bg-B1 shadow-md transition">
      <div className="relative bg-gray-400 h-[230px] rounded-t-lg overflow-hidden">
        <img
          src={image_url}
          alt="coverimages"
          className="w-full h-full object-cover"
        />
        <span
          className={`absolute top-2 left-2 px-3 py-1 bg-C1 text-white rounded-lg text-xs`}
        >
          {can_edit ? "Can Edit" : "View Only"}
        </span>
      </div>
      <div className="p-2 h-[70px] w-full flex items-center">
        <div className="flex-1 flex flex-col gap-2">
          <span className="text-sm font-semibold">{project_name}</span>
          <div className="text-xs flex justify-between">
            <span>{time_recent_access}</span>
            <span>by {owner}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardProject;
