import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { Parameter } from "@/features/systems/libs/ClassParameter/types/Parameter";
import { useProject } from "@/features/systems/contexts/ProjectContext";

interface ParamDropdownProps {
  param: Parameter;
  paramGroup?: string;
}

export default function DropdownMenuDemo({
  param,
  paramGroup,
}: ParamDropdownProps) {
  const { config } = useProject();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-sm text-gray-500 hover:bg-gray-100 p-1 rounded-md">
          <EllipsisVertical size={16} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{param.symbol}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {!paramGroup && (
                  <DropdownMenuItem key="ungrouped">Ungrouped</DropdownMenuItem>
                )}
                {config.parameterGroups
                  .filter((group) => group.id != paramGroup)
                  .map((group) => (
                    <DropdownMenuItem key={group.id?.toString()}>
                      {group.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
