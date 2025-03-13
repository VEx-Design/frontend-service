import { useCanvas } from "@/features/systems/contexts/CanvasContext";
import React, { useState } from "react";
import { Object } from "../Class/object";
import { getInterfacePosition } from "../canvas/edge-routing";

const RightSidebar = () => {
  const { objects, setObjects } = useCanvas() as {
    objects: Object[];
    setObjects: React.Dispatch<React.SetStateAction<Object[]>>;
  };

  const { selectedObjectId } = useCanvas();
  const { mirrors, setDefaultMirror } = useCanvas();

  const { snapEnabled, setSnapEnabled } = useCanvas();

  // Check if selected object is a mirror
  const isSelectedMirror = () => {
    if (!selectedObjectId) return false;
    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    return selectedObject?.isMirror === true;
  };

  // Get current mirror size index
  const getCurrentMirrorSizeIndex = () => {
    if (!selectedObjectId) return 1; // Default to Medium

    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    if (!selectedObject?.isMirror) return 1;

    const { width, height } = selectedObject.size;
    return (
      mirrors.findIndex(
        (size) => size.width === width && size.height === height
      ) || 1
    );
  };

  // Change the size of a mirror
  const changeMirrorSize = (mirrorId: string, sizeIndex: number) => {
    const size = mirrors[sizeIndex];
    if (!size) return;

    const mirror = objects.find((obj) => obj.id === mirrorId);
    if (!mirror || !mirror.isMirror) return;

    // Get the current interface position in absolute coordinates
    const interfacePos = getInterfacePosition(objects, mirrorId, "in");
    if (!interfacePos) return;

    // Get the interface position ratio
    const interfaceRatio = mirror.interfacePositions.get("in");
    if (!interfaceRatio) return;

    // Calculate the reference point offset
    const oldRefX = mirror.referencePosition[0] * mirror.size.width;
    const oldRefY = mirror.referencePosition[0] * mirror.size.height;

    // Calculate the new reference point offset
    const newRefX = mirror.referencePosition[0] * size.width;
    const newRefY = mirror.referencePosition[0] * size.height;

    // Calculate the interface point offset from the reference point in the new size
    const newInterfaceX = interfaceRatio[0] * size.width;
    const newInterfaceY = interfaceRatio[1] * size.height;

    // Calculate the new position to keep the interface point at the same absolute position
    const newPosition = {
      x: interfacePos.x - newInterfaceX + newRefX,
      y: interfacePos.y - newInterfaceY + newRefY,
    };

    // Update the object with the new size and position
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === mirrorId
          ? {
              ...obj,
              size: { width: size.width, height: size.height },
              position: newPosition,
            }
          : obj
      )
    );
  };

  // Rotate an object by 90 degrees clockwise
  const rotateObject = (objectId: string) => {
    const object = objects.find((obj) => obj.id === objectId);
    if (!object) return;

    const newRotation = (object.rotation + 90) % 360;

    // Apply rotation without checking for collisions
    setObjects((prevObjects) =>
      prevObjects.map((obj) =>
        obj.id === objectId ? { ...obj, rotation: newRotation } : obj
      )
    );
  };

  return (
    <div className="w-64 h-full overflow-y-auto p-2 bg-transparent">
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={snapEnabled}
            onChange={(e) => setSnapEnabled(e.target.checked)}
            className="mr-2"
          />
          Snap to Grid
        </label>
      </div>

      <div>
        <label className="block mt-2 text-sm">Default Mirror</label>
        <select
          className="w-full p-1 mt-1 text-sm"
          onChange={(e) => setDefaultMirror(Number(e.target.value))}
        >
          {mirrors.map((mirror, index) => (
            <option key={index} value={index}>
              {mirror.name}
            </option>
          ))}
        </select>
      </div>

      {selectedObjectId && (
        <div className="mt-2 flex space-x-2">
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded"
            onClick={() => selectedObjectId && rotateObject(selectedObjectId)}
            disabled={!selectedObjectId}
          >
            Rotate 90°
          </button>
        </div>
      )}
      {/* Mirror size selector (only shown when a mirror is selected) */}
      {isSelectedMirror() && (
        <div className="mt-2">
          <label>
            Mirror Size:
            <select
              className="w-full p-1 mt-1 text-sm"
              value={getCurrentMirrorSizeIndex()}
              onChange={(e) =>
                changeMirrorSize(selectedObjectId!, Number(e.target.value))
              }
            >
              {mirrors.map((mirror, index) => (
                <option key={index} value={index}>
                  {mirror.name} ({mirror.width}x{mirror.height})
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;
