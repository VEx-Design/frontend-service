import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useProject } from "../contexts/ProjectContext";
import calculate from "../libs/ClassFlow/calculation/calculate";

interface EditorNavbarProps {
  title?: string;
  onSave?: () => void;
  savePending?: boolean;
}

export default function EditorNavbar(props: EditorNavbarProps) {
  const router = useRouter();
  const { config, nodesState, edgesState, setExecutedFlow } = useProject();

  const handleExecute = () => {
    alert("Execute");
    setExecutedFlow(
      calculate({ nodes: nodesState.nodes, edges: edgesState.edges }, config)
    );
  };

  return (
    <div className="flex justify-between items-center border-b px-2 py-2 h-[55px]">
      <div className="flex gap-2">
        <div className="relative w-[70px] h-auto">
          <Image
            src="/VExDesign.svg"
            alt="Logo"
            fill
            className="cursor-pointer"
            priority
            onClick={() => router.push("/project")}
          />
        </div>

        <div className="flex flex-col">
          <input
            type="text"
            className="input text-sm ps-2 focus:border-none focus:border-gray-200"
            value={props.title || "Untitled"}
            onChange={() => {}}
          />
          <div className="flex">
            <div
              className="text-xs px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer"
              onClick={props.onSave}
            >
              Save
            </div>
            <div
              className="text-xs px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer"
              onClick={handleExecute}
            >
              Execute
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
