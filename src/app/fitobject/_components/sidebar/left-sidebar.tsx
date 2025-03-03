import Image from "next/image";
import React, { useState } from "react";
import { useCanvas } from "../canvas/CanvasContext";
import { LuPanelBottomClose, LuPanelTopClose } from "react-icons/lu";

const LeftSidebar = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const { canvas, selectObject } = useCanvas();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-64 h-full overflow-y-auto p-2 bg-transparent">
      <div
        className={`bg-white rounded-md h-full p-4 space-y-4 ${
          isOpen ? "" : "hidden"
        }`}
      >
        {/* Main */}
        <div className="flex justify-between items-center">
          <a href="/project">
            <Image
              src={"/VExDesign.svg"}
              alt={"Logo"}
              height={36}
              width={36}
              style={{ height: "36px", width: "auto" }}
            />
          </a>
          <button onClick={handleClick}>
            <LuPanelTopClose size={18} />
            {}
          </button>
        </div>
        {/* Project */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">Project</div>
          <div className="text-xs text-ChildText pb-2">optical simulator</div>
        </div>

        {/* Object list */}
        <div className="flex flex-col gap-1 ">
          <div className="text-sm">Object list</div>
          <ul className="space-y-1">
            {canvas.objects.map((obj) => (
              <div
                key={obj.id}
                onClick={() => selectObject(obj.id)}
                className={`p-2 rounded cursor-pointer transition-colors ${
                  canvas.selectedObjectId === obj.id
                    ? "bg-gray-200"
                    : "hover:bg-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: obj.fill }}
                  />
                  <span className="text-xs">{obj.name}</span>
                </div>
              </div>
            ))}
          </ul>
        </div>
      </div>

      <div
        className={`bg-white rounded-md h-fit p-4 space-y-4 ${
          isOpen ? "hidden" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <a href="/project">
            <Image
              src={"/VExDesign.svg"}
              alt={"Logo"}
              height={36}
              width={36}
              style={{ height: "36px", width: "auto" }}
            />
          </a>
          <button onClick={handleClick}>
            {}
            <LuPanelBottomClose size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeftSidebar;
