"use client";

import type React from "react";
import { useState } from "react";
import { useCanvas } from "@/features/systems/contexts/CanvasContext";
import type { Object } from "../Class/object";
import { getInterfacePosition } from "../canvas/edge-routing";
import {
  Settings,
  RotateCw,
  Trash2,
  Grid,
  Square,
  TableIcon,
  ArrowLeft,
} from "lucide-react";
import type { Table } from "../Class/table";
import type { Edge } from "../Class/edge";

const RightSidebar = () => {
  const {
    objects,
    setObjects,
    selectedObjectId,
    setSelectedObjectId,
    mirrors,
    setDefaultMirror,
    snapEnabled,
    setSnapEnabled,
    table,
    setTable,
    edges,
    setEdges,
  } = useCanvas() as {
    objects: Object[];
    setObjects: React.Dispatch<React.SetStateAction<Object[]>>;
    selectedObjectId: string | null;
    setSelectedObjectId: (id: string | null) => void;
    mirrors: Array<{ name: string; width: number; height: number }>;
    setDefaultMirror: (index: number) => void;
    snapEnabled: boolean;
    setSnapEnabled: (enabled: boolean) => void;
    table: Table;
    setTable: React.Dispatch<React.SetStateAction<Table>>;
    edges: Edge[];
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  };

  // Local state for table settings (before applying)
  const [tableSettings, setTableSettings] = useState<Table>(table);

  // Check if selected object is a mirror
  const isSelectedMirror = () => {
    if (!selectedObjectId) return false;
    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    return selectedObject?.isMirror === true;
  };

  // Check if selected object is a regular object (not a mirror)
  const isSelectedRegularObject = () => {
    if (!selectedObjectId) return false;
    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    return selectedObject && !selectedObject.isMirror;
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

  // Delete the selected mirror
  const deleteMirror = (mirrorId: string) => {
    const mirror = objects.find((obj) => obj.id === mirrorId && obj.isMirror);
    if (!mirror) return;

    // Find all edges connected to this mirror
    const incomingEdges = edges.filter((edge) => edge.target === mirrorId);
    const outgoingEdges = edges.filter((edge) => edge.source === mirrorId);

    // If we have exactly one incoming and one outgoing edge, reconnect them
    if (incomingEdges.length === 1 && outgoingEdges.length === 1) {
      const incomingEdge = incomingEdges[0];
      const outgoingEdge = outgoingEdges[0];

      // Create a new edge connecting the original source and target
      const newEdge: Edge = {
        id: `edge-${Date.now()}`,
        source: incomingEdge.source,
        sourceInterface: incomingEdge.sourceInterface,
        target: outgoingEdge.target,
        targetInterface: outgoingEdge.targetInterface,
        expectedDistance:
          incomingEdge.expectedDistance + outgoingEdge.expectedDistance,
        actualDistance: 0,
      };

      // Update edges: remove the two connected edges and add the new one
      setEdges((prevEdges) => [
        ...prevEdges.filter(
          (e) => e.id !== incomingEdge.id && e.id !== outgoingEdge.id
        ),
        newEdge,
      ]);
    } else {
      // If the mirror has other connections, just remove the edges connected to it
      setEdges((prevEdges) =>
        prevEdges.filter((e) => e.source !== mirrorId && e.target !== mirrorId)
      );
    }

    // Remove the mirror object
    setObjects((prevObjects) =>
      prevObjects.filter((obj) => obj.id !== mirrorId)
    );

    // If the deleted mirror was selected, clear selection
    if (selectedObjectId === mirrorId) {
      setSelectedObjectId(null);
    }
  };

  // Handle table settings change
  const handleTableSettingChange = (
    field: keyof Table | keyof Table["size"] | keyof Table["margin"],
    value: any,
    parent?: "size" | "margin"
  ) => {
    if (parent) {
      setTableSettings((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value,
        },
      }));
    } else {
      setTableSettings((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  // Apply table settings
  const applyTableSettings = () => {
    setTable(tableSettings);
  };

  // Get the selected object name
  const getSelectedObjectName = () => {
    if (!selectedObjectId) return "";
    const selectedObject = objects.find((obj) => obj.id === selectedObjectId);
    return selectedObject?.name || "Selected Object";
  };

  // Clear selection and return to main controls
  const clearSelection = () => {
    setSelectedObjectId(null);
  };

  return (
    <div className="w-64 h-full overflow-y-auto bg-white text-[#333333] border-l border-[#EEEEEE]">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-3 border-b border-[#EEEEEE]">
          <h2 className="text-sm font-medium">
            {selectedObjectId ? (
              <div className="flex items-center">
                <button
                  onClick={clearSelection}
                  className="mr-2 p-1 rounded hover:bg-[#F8F8F8] transition-colors"
                  title="Back to canvas settings"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
                {getSelectedObjectName()}
              </div>
            ) : (
              "Settings"
            )}
          </h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 space-y-4">
          {/* Show object controls when a regular object is selected */}
          {isSelectedRegularObject() && (
            <div>
              <h3 className="text-xs font-medium text-[#666666] mb-2 flex items-center">
                <Square className="w-3 h-3 mr-1" /> Object Controls
              </h3>
              <div className="space-y-2">
                <button
                  className="inline-flex items-center px-3 py-1.5 w-full justify-center text-xs font-medium rounded border border-[#EEEEEE] hover:bg-[#F8F8F8] transition-colors"
                  onClick={() =>
                    selectedObjectId && rotateObject(selectedObjectId)
                  }
                >
                  <RotateCw className="w-3 h-3 mr-1.5" /> Rotate 90°
                </button>
              </div>
            </div>
          )}

          {/* Show mirror settings when a mirror is selected */}
          {isSelectedMirror() && (
            <div>
              <h3 className="text-xs font-medium text-[#666666] mb-2 flex items-center">
                <Settings className="w-3 h-3 mr-1" /> Mirror Settings
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="block text-xs text-[#666666] mb-1">
                    Mirror Size
                  </label>
                  <select
                    className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD] bg-white"
                    value={getCurrentMirrorSizeIndex()}
                    onChange={(e) =>
                      changeMirrorSize(
                        selectedObjectId!,
                        Number(e.target.value)
                      )
                    }
                  >
                    {mirrors.map((mirror, index) => (
                      <option key={index} value={index}>
                        {mirror.name} ({mirror.width}x{mirror.height})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  className="inline-flex items-center px-3 py-1.5 w-full justify-center text-xs font-medium rounded border border-[#EEEEEE] hover:bg-[#F8F8F8] transition-colors"
                  onClick={() =>
                    selectedObjectId && rotateObject(selectedObjectId)
                  }
                >
                  <RotateCw className="w-3 h-3 mr-1.5" /> Rotate 90°
                </button>

                <button
                  className="inline-flex items-center px-3 py-1.5 w-full justify-center text-xs font-medium rounded border border-[#EEEEEE] hover:bg-[#F8F8F8] transition-colors text-red-500"
                  onClick={() =>
                    selectedObjectId && deleteMirror(selectedObjectId)
                  }
                >
                  <Trash2 className="w-3 h-3 mr-1.5" /> Delete Mirror
                </button>
              </div>
            </div>
          )}

          {/* Show grid and table settings when no object is selected */}
          {!selectedObjectId && (
            <>
              {/* Grid Settings */}
              <div>
                <h3 className="text-xs font-medium text-[#666666] mb-2 flex items-center">
                  <Grid className="w-3 h-3 mr-1" /> Grid Settings
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center text-xs text-[#333333]">
                    <input
                      type="checkbox"
                      checked={snapEnabled}
                      onChange={(e) => setSnapEnabled(e.target.checked)}
                      className="mr-2 h-3 w-3 rounded border-[#EEEEEE] checked:bg-[#333333] checked:hover:bg-[#333333] focus:ring-0"
                    />
                    Snap to Grid
                  </label>

                  <div>
                    <label className="block text-xs text-[#666666] mb-1">
                      Default Mirror
                    </label>
                    <select
                      className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD] bg-white"
                      onChange={(e) => setDefaultMirror(Number(e.target.value))}
                    >
                      {mirrors.map((mirror, index) => (
                        <option key={index} value={index}>
                          {mirror.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Table Configuration */}
              <div>
                <h3 className="text-xs font-medium text-[#666666] mb-2 flex items-center">
                  <TableIcon className="w-3 h-3 mr-1" /> Table Configuration
                </h3>
                <div className="space-y-2">
                  {/* Table Size */}
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">
                      Table Size
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#666666] mb-0.5">
                          Width (mm)
                        </label>
                        <input
                          type="number"
                          value={tableSettings.size.width}
                          onChange={(e) =>
                            handleTableSettingChange(
                              "width",
                              Number(e.target.value),
                              "size"
                            )
                          }
                          className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#666666] mb-0.5">
                          Height (mm)
                        </label>
                        <input
                          type="number"
                          value={tableSettings.size.height}
                          onChange={(e) =>
                            handleTableSettingChange(
                              "height",
                              Number(e.target.value),
                              "size"
                            )
                          }
                          className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Table Margin */}
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">
                      Table Margin
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] text-[#666666] mb-0.5">
                          Width (mm)
                        </label>
                        <input
                          type="number"
                          value={tableSettings.margin.width}
                          onChange={(e) =>
                            handleTableSettingChange(
                              "width",
                              Number(e.target.value),
                              "margin"
                            )
                          }
                          className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#666666] mb-0.5">
                          Height (mm)
                        </label>
                        <input
                          type="number"
                          value={tableSettings.margin.height}
                          onChange={(e) =>
                            handleTableSettingChange(
                              "height",
                              Number(e.target.value),
                              "margin"
                            )
                          }
                          className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Grid Distance */}
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">
                      Grid Distance (mm)
                    </label>
                    <input
                      type="number"
                      value={tableSettings.gridDistance}
                      onChange={(e) =>
                        handleTableSettingChange(
                          "gridDistance",
                          Number(e.target.value)
                        )
                      }
                      className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD]"
                    />
                  </div>

                  {/* Grid Style */}
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">
                      Grid Style
                    </label>
                    <select
                      value={tableSettings.gridStyle}
                      onChange={(e) =>
                        handleTableSettingChange("gridStyle", e.target.value)
                      }
                      className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD] bg-white"
                    >
                      <option value="dot">Dot</option>
                      <option value="line">Line</option>
                    </select>
                  </div>

                  {/* Grid Color */}
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">
                      Grid Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={tableSettings.gridColor}
                        onChange={(e) =>
                          handleTableSettingChange("gridColor", e.target.value)
                        }
                        className="h-6 w-6 rounded border-[#EEEEEE] mr-2"
                      />
                      <input
                        type="text"
                        value={tableSettings.gridColor}
                        onChange={(e) =>
                          handleTableSettingChange("gridColor", e.target.value)
                        }
                        className="block w-full rounded border border-[#EEEEEE] py-1.5 px-2 text-xs focus:outline-none focus:border-[#DDDDDD]"
                      />
                    </div>
                  </div>

                  {/* Grid Opacity */}
                  <div>
                    <label className="block text-xs text-[#666666] mb-1">
                      Grid Opacity: {tableSettings.gridOpacity}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={tableSettings.gridOpacity}
                      onChange={(e) =>
                        handleTableSettingChange(
                          "gridOpacity",
                          Number(e.target.value)
                        )
                      }
                      className="mt-1 block w-full accent-[#333333]"
                    />
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={applyTableSettings}
                    className="w-full inline-flex justify-center items-center px-3 py-1.5 text-xs font-medium rounded border border-[#EEEEEE] hover:bg-[#F8F8F8] transition-colors mt-2"
                  >
                    Apply Table Settings
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;
