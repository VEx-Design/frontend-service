import Image from "next/image";
import React, { useState } from "react";
import { useCanvas } from "../canvas/CanvasContext";
import { LuPanelBottomClose, LuPanelTopClose } from "react-icons/lu";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
// import { TbGridDots } from "react-icons/tb";

const LeftSidebar = ({}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isLock, setIsLock] = useState<boolean>(true);
  const { canvasState, setCanvasState } = useCanvas();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handdleLock = () => {
    setIsLock(!isLock);
  };

  const handleDimensionChange = (key: "width" | "height", value: number) => {
    setCanvasState((prev) => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        [key]: value,
      },
    }));
  };

  const handleGridChange = (
    key: "showGrid" | "gridSize" | "gridColor" | "gridOpacity" | "gridStyle",
    value: boolean | number | string
  ) => {
    setCanvasState((prev) => ({
      ...prev,
      canvas: {
        ...prev.canvas,
        [key]: value,
      },
    }));
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
        {/* Table Size */}
        <div className="flex flex-col gap-1 border-b">
          <div className="flex justify-between items-center">
            <div className="text-sm">Table Size</div>
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
              <label className="text-xs text-ChildText" htmlFor="width">
                Width
              </label>
              <input
                type="number"
                value={canvasState.canvas.width}
                onChange={(e) =>
                  handleDimensionChange("width", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                disabled={isLock}
                id="width"
              />
            </div>
            <div>
              <label className="text-xs text-ChildText" htmlFor="height">
                Height
              </label>
              <input
                type="number"
                value={canvasState.canvas.height}
                onChange={(e) =>
                  handleDimensionChange("height", Number(e.target.value))
                }
                className="w-full bg-gray-200 rounded px-2 py-1 mt-1 mb-2"
                disabled={isLock}
                id="height"
              />
            </div>
          </div>
        </div>
        {/* Grid Layout section */}
        <div className="flex flex-col gap-1 border-b pb-4">
          <div className="flex justify-between items-center">
            <div className="text-sm">Layout Grid</div>
            <label className="relative inline-flex items-center cursor-pointer">
              {}
              <input
                type="checkbox"
                checked={canvasState.canvas.showGrid}
                onChange={(e) => handleGridChange("showGrid", e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {canvasState.canvas.showGrid && (
            <div className="space-y-1 mt-2">
              {/* Grid Size and Grid Style */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-ChildText" htmlFor="grid">
                    Grid Size
                  </label>
                  <input
                    type="number"
                    value={canvasState.canvas.gridSize}
                    onChange={(e) =>
                      handleGridChange("gridSize", Number(e.target.value))
                    }
                    min={25}
                    max={100}
                    className="w-full bg-gray-200 rounded px-2 py-1 mt-1"
                    id="grid"
                  />
                </div>
                <div>
                  <label className="text-xs text-ChildText">Grid Style</label>
                  <select
                    value={canvasState.canvas.gridStyle}
                    onChange={(e) =>
                      handleGridChange("gridStyle", e.target.value)
                    }
                    className="w-full bg-gray-200 rounded px-2 py-1 mt-1"
                    aria-label="gridstyle"
                  >
                    <option value="dot">Dot</option>
                    <option value="line">Line</option>
                  </select>
                </div>
              </div>

              {/* Grid Opacity */}
              <div>
                <label className="text-xs text-ChildText" htmlFor="opacity">
                  Opacity
                </label>
                <input
                  type="range"
                  value={canvasState.canvas.gridOpacity}
                  onChange={(e) =>
                    handleGridChange("gridOpacity", Number(e.target.value))
                  }
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                  id="opacity"
                />
              </div>
              {/* Grid Color */}
              <div>
                <label className="text-xs text-ChildText" htmlFor="color">
                  Color
                </label>
                <input
                  type="color"
                  value={canvasState.canvas.gridColor}
                  onChange={(e) =>
                    handleGridChange("gridColor", e.target.value)
                  }
                  className="w-full h-8 p-1 bg-gray-200 rounded mt-1"
                  id="color"
                />
              </div>
            </div>
          )}
        </div>
        {/* Object list */}
        <div className="flex flex-col gap-1 ">
          <div className="text-sm">Object list</div>
          <ul className="space-y-1">
            {canvasState.objects.map((obj) => (
              <div
                key={obj.id}
                onClick={() =>
                  setCanvasState({ ...canvasState, selectedObject: obj })
                }
                className={`p-2 rounded cursor-pointer transition-colors ${
                  canvasState.selectedObject?.id === obj.id
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
