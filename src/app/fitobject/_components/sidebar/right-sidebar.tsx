import React, { useState } from "react";
import { LuPanelBottomClose, LuPanelTopClose } from "react-icons/lu";
import { MdOutlineLock, MdOutlineLockOpen } from "react-icons/md";
import { UserButton } from "@clerk/nextjs";
import { useCanvas } from "../canvas/CanvasContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RightSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLock, setIsLock] = useState(true);
  const handleClick = () => setIsOpen((prev) => !prev);
  const handleLock = () => setIsLock((prev) => !prev);

  const { canvas, getSelectedObject, updateObject, updateCanvas, setGrid } =
    useCanvas();
  const selectObject = getSelectedObject();

  const renderObjectProperties = () => {
    if (!selectObject) return null;

    return (
      <div className="space-y-4">
        {/* Properties */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">Properties</div>
          <div className="text-xs text-gray-500 pb-2">
            {selectObject.name || "Select an object"}
          </div>
        </div>

        {/* ID */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">ID</div>
          <div className="text-xs text-gray-500 pb-2">
            {selectObject.id || "Select an object"}
          </div>
        </div>

        {/* Position */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">Position</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <Label className="text-xs text-gray-500">X</Label>
              <Input
                type="number"
                value={Math.floor(selectObject.x)}
                onChange={(e) =>
                  updateObject(selectObject.id, { x: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Y</Label>
              <Input
                type="number"
                value={Math.floor(selectObject.y)}
                onChange={(e) =>
                  updateObject(selectObject.id, { y: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        {/* Reference Position */}
        <div className="flex flex-col gap-1 border-b">
          <div className="text-sm">Reference Position</div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <Label className="text-xs text-gray-500">X Ratio</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={
                  selectObject.referencePosition
                    ? selectObject.referencePosition[0]
                    : 0.5
                }
                onChange={(e) =>
                  updateObject(selectObject.id, {
                    referencePosition: [
                      Number(e.target.value),
                      selectObject.referencePosition
                        ? selectObject.referencePosition[1]
                        : 0.5,
                    ],
                  })
                }
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Y Ratio</Label>
              <Input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={
                  selectObject.referencePosition
                    ? selectObject.referencePosition[1]
                    : 0.5
                }
                onChange={(e) =>
                  updateObject(selectObject.id, {
                    referencePosition: [
                      selectObject.referencePosition
                        ? selectObject.referencePosition[0]
                        : 0.5,
                      Number(e.target.value),
                    ],
                  })
                }
              />
            </div>
          </div>
          <div className="text-xs text-gray-500 pb-2">
            Values between 0-1 <br />
            (0,0 = top-left, 1,1 = bottom-right)
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
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <Label className="text-xs text-gray-500">Width</Label>
              <Input
                type="number"
                value={selectObject.width}
                onChange={(e) =>
                  updateObject(selectObject.id, {
                    width: Number(e.target.value),
                  })
                }
                disabled={isLock}
              />
            </div>
            <div>
              <Label className="text-xs text-gray-500">Height</Label>
              <Input
                type="number"
                value={selectObject.height}
                onChange={(e) =>
                  updateObject(selectObject.id, {
                    height: Number(e.target.value),
                  })
                }
                disabled={isLock}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderCanvasProperties = () => {
    return (
      <div className="space-y-4">
        {/* Table Size */}
        <div className="flex flex-col gap-1 border-b">
          <div className="flex justify-between items-center">
            <Label className="text-sm">Table Size</Label>
            <button onClick={handleLock}>
              {isLock ? (
                <MdOutlineLock size={15} />
              ) : (
                <MdOutlineLockOpen size={15} />
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <Label className="text-xs text-ChildText" htmlFor="width">
                Width
              </Label>
              <Input
                type="number"
                value={Math.floor(canvas.canvasWidth / 10)}
                onChange={(e) =>
                  updateCanvas({ canvasWidth: Number(e.target.value) })
                }
                disabled={true}
                id="width"
              />
            </div>
            <div>
              <Label className="text-xs text-ChildText" htmlFor="height">
                Height
              </Label>
              <Input
                type="number"
                value={Math.floor(canvas.canvasHeight / 10)}
                onChange={(e) =>
                  updateCanvas({ canvasHeight: Number(e.target.value) })
                }
                disabled={true}
                id="height"
              />
            </div>
          </div>
        </div>
        {/* Grid Layout section */}
        <div className="flex flex-col gap-1 border-b pb-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm">Layout Grid</Label>
            <Switch
              checked={canvas.grid.showGrid}
              onCheckedChange={(checked) => setGrid({ showGrid: checked })}
            />
          </div>

          {canvas.grid.showGrid && (
            <div className="space-y-1 mt-2">
              <div className="grid grid-cols-2 gap-2 ">
                {/* Grid Size */}
                <div>
                  <Label className="text-xs text-ChildText">Grid Size</Label>
                  <Input
                    type="number"
                    value={canvas.grid.gridSize}
                    onChange={(e) =>
                      setGrid({ gridSize: Number(e.target.value) })
                    }
                    onKeyDown={(e) =>
                      setGrid({ gridSize: Number(e.currentTarget.value) })
                    }
                    min={25}
                    max={100}
                  />
                </div>
                {/* Grid Style */}
                <div>
                  <Label className="text-xs text-ChildText">Grid Style</Label>
                  <Select
                    value={canvas.grid.gridStyle}
                    onValueChange={(value: "dot" | "line") =>
                      setGrid({ gridStyle: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="dot">Dot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid Opacity */}
              <div>
                <Label className="text-xs text-ChildText">Opacity</Label>
                <Slider
                  value={[canvas.grid.gridOpacity * 100]}
                  min={0}
                  max={100}
                  onValueChange={([value]) =>
                    setGrid({ gridOpacity: value / 100 })
                  }
                  className="mt-2"
                />
              </div>
              {/* Grid Color */}
              <div>
                <Label className="text-xs text-ChildText">Color</Label>
                <Input
                  type="color"
                  value={canvas.grid.gridColor}
                  onChange={(e) => setGrid({ gridColor: e.target.value })}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="w-64 h-full overflow-y-auto p-2 bg-transparent">
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
        {selectObject ? renderObjectProperties() : renderCanvasProperties()}
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
