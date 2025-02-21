import React, { useEffect, useState } from "react";
import { LuPanelBottomClose, LuPanelTopClose } from "react-icons/lu";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { UserButton } from "@clerk/nextjs";
import { useCanvas } from "../canvas/CanvasContext";

const RightSidebar = () => {
  const [properties, setProperties] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    fill: "#000000",
  });
  const [isOpen, setIsOpen] = useState(true);
  const [isLock, setIsLock] = useState(true);
  const { canvasState, setCanvasState } = useCanvas();

  const handleClick = () => setIsOpen((prev) => !prev);
  const handleLock = () => setIsLock((prev) => !prev);

  useEffect(() => {
    if (canvasState.selectedObject) {
      const { x, y, width, height, fill } = canvasState.selectedObject;
      setProperties({ x, y, width, height, fill });
    }
  }, [canvasState.selectedObject]);

  const handlePropertyChange = (property: string, value: number | string) => {
    setProperties((prev) => ({ ...prev, [property]: value }));

    setCanvasState((prev) => ({
      ...prev,
      objects: prev.objects.map((object) =>
        object.id === canvasState.selectedObject?.id
          ? { ...object, [property]: value }
          : object
      ),
    }));
  };

  return (
    <div className="w-64 h-full overflow-y-auto p-2 bg-gray-200">
      <div
        className={`bg-white rounded-md h-full p-4 space-y-4 ${
          isOpen ? "" : "hidden"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <button onClick={handleClick}>
            {}
            <LuPanelTopClose size={18} />
          </button>
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }}
          />
        </div>

        {/* Properties */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">Properties</div>
          <div className="text-xs text-gray-500 pb-2">
            {canvasState.selectedObject?.name || "Select an object"}
          </div>
        </div>

        {/* ID */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">ID</div>
          <div className="text-xs text-gray-500 pb-2">
            {canvasState.selectedObject?.id || "Select an object"}
          </div>
        </div>

        {/* Position */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">Position</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500" htmlFor="x">
                X
              </label>
              <input
                type="number"
                value={properties.x}
                onChange={(e) =>
                  handlePropertyChange("x", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                id="x"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500" htmlFor="y">
                Y
              </label>
              <input
                type="number"
                value={properties.y}
                onChange={(e) =>
                  handlePropertyChange("y", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                id="y"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div className="flex flex-col gap-1 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm">Size</div>
            <button onClick={handleLock}>
              {isLock ? (
                <MdOutlineLock size={15} />
              ) : (
                <MdOutlineLockOpen size={15} />
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-500" htmlFor="width">
                Width
              </label>
              <input
                type="number"
                value={properties.width}
                onChange={(e) =>
                  handlePropertyChange("width", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                id="width"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500" htmlFor="height">
                Height
              </label>
              <input
                type="number"
                value={properties.height}
                onChange={(e) =>
                  handlePropertyChange("height", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                id="height"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Closed */}
      <div
        className={`bg-white rounded-md h-fit p-4 space-y-4 ${
          isOpen ? "hidden" : ""
        }`}
      >
        <div className="flex justify-between items-center">
          <button onClick={handleClick}>
            {}
            <LuPanelBottomClose size={18} />
          </button>
          <UserButton
            appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }}
          />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
