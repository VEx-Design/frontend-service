import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface EditorNavbarProps {
  title?: string;
  onSave?: () => void;
  savePending?: boolean;
}

export default function EditorNavbar(props: EditorNavbarProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center border-b px-2 py-2 h-[55px]">
      <div className="flex gap-2">
        <Image
          src="/VExDesign.svg"
          alt="Logo"
          width={70}
          height={200}
          layout="intrinsic"
          onClick={() => router.push("/project")}
          className="cursor-pointer"
        />
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
            <div className="text-xs px-2 py-1 hover:bg-slate-100 rounded-sm cursor-pointer">
              Execute
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
