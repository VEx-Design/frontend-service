import React, { useEffect, useState } from 'react';
import { useBox } from '../../contexts/BoxContext';
import { BoxConfig } from '../../libs/ClassBox/types/BoxConfig';

export default function BoxSizing() {
  const { focusNode, map, setMap } = useBox();
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');

  useEffect(() => {
    if (!focusNode) {
      setHeight('');
      setWidth('');
      return;
    }

    const nodeInfo = map.get(focusNode.id);
    if (nodeInfo) {
      setHeight(nodeInfo.height.toString());
      setWidth(nodeInfo.width.toString());
    } else {
      setHeight('');
      setWidth('');
    }
  }, [focusNode, map]);

  const handleSave = () => {
    if (!focusNode) return;

    setMap((prevMap: Map<string, BoxConfig>) => {
      const existingConfig: BoxConfig | undefined = prevMap.get(focusNode.id);
      const newHeight: number = Number(height) || 0;
      const newWidth: number = Number(width) || 0;

      if (existingConfig?.height === newHeight && existingConfig?.width === newWidth) {
      return prevMap; 
      }

      const updatedMap: Map<string, BoxConfig> = new Map(prevMap);
      updatedMap.set(focusNode.id, new BoxConfig(newHeight, newWidth));
      return updatedMap;
    });
  };

  return (
    <div>
      {focusNode ? (
        <>
          <div>{focusNode.id}</div>
          <div>
            <label>
              Height:
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              Width:
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </label>
          </div>
          <button onClick={handleSave}>Save</button>
        </>
      ) : (
        <div>No node selected</div>
      )}
    </div>
  );
}