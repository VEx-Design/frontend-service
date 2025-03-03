import React, { useEffect, useState } from "react";
import { useBox } from "../../contexts/BoxContext";
import { BoundingConfiguration } from "../../libs/ClassBox/types/BoundingConfiguration";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export default function BoxSizing() {
  const { focusNode, mapBounding, setMapBounding, focusPoint, setFocusPoint, config, nodesState } = useBox();
  const [height, setHeight] = useState("");
  const [width, setWidth] = useState("");
  const [interfaces, setInterfaces] = useState<[string, string][]>([]);
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
    if (node?.type === "ObjectNode") {
      const typeID = node?.data.data.object?.typeId;
      const interfaces = config.types.find((type) => type.id === typeID)?.interfaces;
      if (interfaces) {
        setInterfaces(interfaces.map((intf) => [intf.id, intf.name]));
      } else {
        setInterfaces([]);
      }
    } else if (node?.type === "starter") {
      setInterfaces([["starter", "Output"]]);
    } else {
      setInterfaces([["terminal", "Input"]]);
    }

    setShowSaveHeight(false);
    setShowSaveWidth(false);
  }, [focusNode, mapBounding, config.types]);

  const handleSave = () => {
    if (!focusNode) return;

    let prevMap = mapBounding;
    const existingConfig: BoundingConfiguration | undefined = prevMap.get(focusNode.id);
    let newHeight: number = Number(height) || 0;
    let newWidth: number = Number(width) || 0;

    // Ensure height and width do not exceed 1000
    if (newHeight > 1000) newHeight = 1000;
    if (newWidth > 1000) newWidth = 1000;

    const referencePoint = existingConfig?.referencePosition || [0, 0];
    const interfacePositions = existingConfig?.interfacePositions || new Map();

    if (!(existingConfig?.height === newHeight && existingConfig?.width === newWidth)) {
      const updatedMap: Map<string, BoundingConfiguration> = new Map(prevMap);
      updatedMap.set(focusNode.id, new BoundingConfiguration("", newHeight, newWidth, referencePoint, interfacePositions));
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

  const setReferencePoint = (point: [number, number]) => {
    if (!focusNode) return;
    setMapBounding((prev) => {
      const newMapBounding = new Map(prev);
      const nodeInfo = newMapBounding.get(focusNode.id);
      if (nodeInfo) {
        newMapBounding.set(focusNode.id, {
          ...nodeInfo,
          referencePosition: point,
        });
      }
      return newMapBounding;
    });
  };

  const setInterfacePoint = (intf: string, point: [number, number]) => {
    if (!focusNode) return;
    setMapBounding((prev) => {
      const newMapBounding = new Map(prev);
      const nodeInfo = newMapBounding.get(focusNode.id);
      if (nodeInfo) {
        const newInterfacePositions = new Map(nodeInfo.interfacePositions);
        newInterfacePositions.set(intf, point);
        newMapBounding.set(focusNode.id, {
          ...nodeInfo,
          interfacePositions: newInterfacePositions,
        });
      }
      return newMapBounding;
    });
  };

  const ReferencePointActions = [
    { name: "Top Left", onClick: () => setReferencePoint([0, 0]) },
    { name: "Top Center", onClick: () => setReferencePoint([0.5, 0]) },
    { name: "Top Right", onClick: () => setReferencePoint([1, 0]) },
    { name: "Middle Left", onClick: () => setReferencePoint([0, 0.5]) },
    { name: "Middle Center", onClick: () => setReferencePoint([0.5, 0.5]) },
    { name: "Middle Right", onClick: () => setReferencePoint([1, 0.5]) },
    { name: "Bottom Left", onClick: () => setReferencePoint([0, 1]) },
    { name: "Bottom Center", onClick: () => setReferencePoint([0.5, 1]) },
    { name: "Bottom Right", onClick: () => setReferencePoint([1, 1]) },
  ];

  const InterfacePointActions = ([intfId, intfName]: [string, string]) => ([
    { name: `Top Left`, onClick: () => setInterfacePoint(intfId, [0, 0]) },
    { name: `Top Center`, onClick: () => setInterfacePoint(intfId, [0.5, 0]) },
    { name: `Top Right`, onClick: () => setInterfacePoint(intfId, [1, 0]) },
    { name: `Middle Left`, onClick: () => setInterfacePoint(intfId, [0, 0.5]) },
    { name: `Middle Center`, onClick: () => setInterfacePoint(intfId, [0.5, 0.5]) },
    { name: `Middle Right`, onClick: () => setInterfacePoint(intfId, [1, 0.5]) },
    { name: `Bottom Left`, onClick: () => setInterfacePoint(intfId, [0, 1]) },
    { name: `Bottom Center`, onClick: () => setInterfacePoint(intfId, [0.5, 1]) },
    { name: `Bottom Right`, onClick: () => setInterfacePoint(intfId, [1, 1]) },
  ])

  const DropdownMenuComponent = ({ label, actions }: { label: string; actions: { name: string; onClick: () => void }[] }) => {
    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button onClick={(e) => e.stopPropagation()}>{label}</button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content side="bottom" align="start" style={{ maxHeight: "100px", overflowY: "auto" }}>
            {actions.map((action, index) => (
              <DropdownMenu.Item key={index} onClick={(e) => { e.stopPropagation(); action.onClick(); }}>
                {action.name}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
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
            <label>Reference Point</label>
            <ul>
              <li
                style={{ fontWeight: focusPoint === "Reference Point" ? "bold" : "normal" }}
              >
                Reference Point  <DropdownMenuComponent label="Position" actions={ReferencePointActions} />
              </li>
            </ul>
          </div>
          <div>
            <label>Interfaces</label>
            <ul>
              {interfaces.map((intf, index) => (
                <li
                  key={`${intf[0]}-${index}`}
                  style={{ fontWeight: focusPoint === intf[0] ? "bold" : "normal" }}
                >
                  {intf[1]} <DropdownMenuComponent label="Position" actions={InterfacePointActions(intf)} />
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