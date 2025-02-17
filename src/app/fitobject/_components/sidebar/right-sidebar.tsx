import React, { useEffect, useState } from "react";
import { LuPanelBottomClose, LuPanelTopClose } from "react-icons/lu";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { UserButton } from "@clerk/nextjs";
interface CanvasObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  imageUrl: string;
  connectedTo: string[]; // Array of object IDs this object is connected to
  isStartNode?: boolean; // Mark if this is the starting node
}

interface RightSidebarProps {
  selectedObject: CanvasObject | null;
  setObjects: React.Dispatch<React.SetStateAction<CanvasObject[]>>;
}

const RightSidebar = ({ selectedObject, setObjects }: RightSidebarProps) => {
  const [properties, setProperties] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: "#000000",
  });
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLock, setIsLock] = useState<boolean>(true);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handdleLock = () => {
    setIsLock(!isLock);
  };

  useEffect(() => {
    if (selectedObject) {
      setProperties({
        x: selectedObject.x,
        y: selectedObject.y,
        width: selectedObject.width,
        height: selectedObject.height,
        fill: selectedObject.fill,
      });
    }
  }, [selectedObject]);

  const handlePropertyChange = (property: string, value: number | string) => {
    setProperties((prev) => ({ ...prev, [property]: value }));
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === selectedObject?.id ? { ...obj, [property]: value } : obj
      )
    );
  };

  return (
    <div className="w-64 h-full overflow-y-auto p-2 bg-gray-200">
      <div
        className={`bg-white rounded-md h-full p-4 space-y-4 ${
          isOpen ? "" : "hidden"
        }`}
      >
        {/* Main */}
        <div className="flex justify-between items-center">
          <button onClick={handleClick}>
            <LuPanelTopClose size={18} />
          </button>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
              },
            }}
          />
        </div>

        {/* Properties */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">Properties</div>
          <div className="text-xs text-ChildText pb-2">
            {selectedObject ? selectedObject.name : "Select an object"}
          </div>
        </div>
        {/* ID */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">ID</div>
          <div className="text-xs text-ChildText pb-2">
            {selectedObject ? selectedObject.id : "Select an object"}
          </div>
        </div>
        {/* Position */}
        <div className="flex flex-col gap-1 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm">Position</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-ChildText">X</label>
              <input
                type="number"
                value={properties.x}
                onChange={(e) =>
                  handlePropertyChange("x", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
              />
            </div>
            <div>
              <label className="text-xs text-ChildText">Y</label>
              <input
                type="number"
                value={properties.y}
                onChange={(e) =>
                  handlePropertyChange("y", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
              />
            </div>
          </div>
        </div>
        {/* Size */}
        <div className="flex flex-col gap-1 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm">Size</div>
            <button onClick={handdleLock}>
              {isLock ? (
                <MdOutlineLock size={15} />
              ) : (
                <MdOutlineLockOpen size={15} />
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-ChildText">Width</label>
              <input
                type="number"
                value={properties.width}
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                disabled
              />
            </div>
            <div>
              <label className="text-xs text-ChildText">Height</label>
              <input
                type="number"
                value={properties.height}
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                disabled
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`bg-white rounded-md h-fit p-4 space-y-4 ${
          isOpen ? "hidden" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <button onClick={handleClick}>
            <LuPanelBottomClose size={18} />
          </button>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
