import React from "react";
import { GoKebabHorizontal } from "react-icons/go";

interface ListProjectProps {
  project_name: string;
  owner: string;
  time_recent_access: string;
  image_url: string;
  can_edit: boolean;
}

function ListProject({
  project_name,
  owner,
  time_recent_access,
  image_url,
  can_edit,
}: ListProjectProps) {
  return (
    <div className="flex items-center rounded-md p-2 text-sm hover:bg-B1">
      <img src={image_url} alt="" className="w-7 h-7 rounded object-cover" />
      <div className="flex border-r-2 px-3 flex-1 gap-3 flex-wrap justify-between">
        <span className="font-semibold ">{project_name}</span>
        <div
          className={`${
            can_edit ? "bg-C1" : "bg-gray-400"
          } text-white w-fit px-2 py-1 text-xs rounded-lg`}
        >
          {can_edit ? "Can Edit" : "View Only"}
        </div>
      </div>
      <span className="text-xs text-gray-400 border-r-2 px-3 flex-initial w-[150px] truncate hidden sm:block">
        {time_recent_access}
      </span>
      <span className="text-xs text-gray-400 border-r-2 px-3 flex-initial w-[150px] truncate hidden sm:block ">
        by {owner}
      </span>
      <div className="pl-2">
        <GoKebabHorizontal />
      </div>
    </div>
  );
}

export default ListProject;
