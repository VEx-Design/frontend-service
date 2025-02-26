import React, { useEffect, useState } from "react";
import { useBox } from "../../contexts/BoxContext";
import { BoundingConfiguration } from "../../libs/ClassBox/types/BoundingConfiguration";
import { set } from "lodash";

export default function BoxSizing() {
  const { focusNode, mapBounding, setMapBounding, focusPoint, setFocusPoint, config, nodesState } = useBox();
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [interfaces, setInterfaces] = useState<[string,string][]>([]);
  const [showSaveHeight, setShowSaveHeight] = useState(false);
  const [showSaveWidth, setShowSaveWidth] = useState(false);

  useEffect(() => {
    setFocusPoint("");

    if (!focusNode) {
      setHeight("");
      setWidth("");
      setInterfaces([]);
      setShowSaveHeight(false);
      setShowSaveWidth(false);
      return;
    }

    const nodeInfo = mapBounding.get(focusNode.id);
    if (nodeInfo) {
      setHeight(nodeInfo.height.toString());
      setWidth(nodeInfo.width.toString());
    } else {
      setHeight("");
      setWidth("");
    }

    const nodeId = focusNode.id;
    const node = nodesState.nodes.find((node) => node.id === nodeId);
    if(node?.type === "ObjectNode"){
      const typeID = node?.data.data.object?.typeId;
      const interfaces = config.types.find((type) => type.id === typeID)?.interfaces;
      if (interfaces) {
        setInterfaces(interfaces.map((intf) => [intf.id, intf.name]));
      } else {
        setInterfaces([]);
      }
    }
    else if (node?.type === "starter"){
      setInterfaces([["starter", "Output"]]);
    }
    else{
      setInterfaces([["terminal", "Input"]]);
    }

    setShowSaveHeight(false);
    setShowSaveWidth(false);

  }, [focusNode, mapBounding, config.types]);

  const handleSave = () => {
    if (!focusNode) return;

    let prevMap = mapBounding
    const existingConfig: BoundingConfiguration | undefined = prevMap.get(focusNode.id);
    const newHeight: number = Number(height) || 0;
    const newWidth: number = Number(width) || 0;
    const referencePoint = existingConfig?.referencePosition || [0, 0];
    const interfacePositions = existingConfig?.interfacePositions || new Map();

    if (!(existingConfig?.height === newHeight && existingConfig?.width === newWidth)) {
      const updatedMap: Map<string, BoundingConfiguration> = new Map(prevMap);
      updatedMap.set(focusNode.id, new BoundingConfiguration(newHeight, newWidth, referencePoint, interfacePositions));
      setMapBounding(updatedMap);
    }

    setShowSaveHeight(false);
    setShowSaveWidth(false);
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value);
    setShowSaveHeight(true);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(e.target.value);
    setShowSaveWidth(true);
  };

  return (
    <div onClick={() => setFocusPoint("")} style={{ position: "static" }}>
      {focusNode ? (
        <>
          <div>{focusNode.id}</div>
          <div>
            <label>
              Height:
              <input
                type="number"
                value={height}
                onChange={handleHeightChange}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
            {showSaveHeight && (
              <span
                style={{ color: "green", marginLeft: "10px", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                ✔
              </span>
            )}
          </div>
          <div>
            <label>
              Width:
              <input
                type="number"
                value={width}
                onChange={handleWidthChange}
                onClick={(e) => e.stopPropagation()}
              />
            </label>
            {showSaveWidth && (
              <span
                style={{ color: "green", marginLeft: "10px", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                ✔
              </span>
            )}
          </div>
          <div>
            <label>Reference Point:</label>
            <ul>
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  setFocusPoint("Reference Point");
                }}
                style={{ fontWeight: focusPoint === "Reference Point" ? "bold" : "normal" }}
              >
                Reference Point
              </li>
            </ul>
          </div>
          <div>
            <label>Interfaces:</label>
            <ul>
              {interfaces.map((intf, index) => (
                <li
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusPoint(intf[0]);
                  }}
                  style={{ fontWeight: focusPoint === intf[0] ? "bold" : "normal" }}
                >
                  {intf[1]}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div>No node selected</div>
      )}
    </div>
  );
}