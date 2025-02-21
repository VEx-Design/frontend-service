import React, { use, useEffect, useState } from 'react';
import { useBox } from '../../contexts/BoxContext';
import { BoxConfig } from '../../libs/ClassBox/types/BoxConfig';

export default function BoxSizing() {
  const { focusNode } = useBox();
  const { boxInformation } = useBox();
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (focusNode) {
      const nodeInfo = boxInformation.information.get(focusNode.id);
      if (nodeInfo) {
        setHeight(nodeInfo.height);
        setWidth(nodeInfo.width);
      } else {
        setHeight(0);
        setWidth(0);
      }
    }
  }, [focusNode]);

  useEffect(()=>{
    if(focusNode){
      const nodeInfo = boxInformation.information.get(focusNode.id);
      if(nodeInfo){
        let newBoxConfig = new BoxConfig(height, width);
        boxInformation.information.set(focusNode.id, newBoxConfig);
        console.log(boxInformation.information);
      }else{
        boxInformation.information.set(focusNode.id, new BoxConfig(height, width));
        console.log(boxInformation.information);
      }
    }
  },[height, width])

  return (
    <div>
      <div>{focusNode?.id}</div>
      <div>
        <label>
          Height:
          <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
        </label>
      </div>
      <div>
        <label>
          Width:
          <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
        </label>
      </div>
    </div>
  );
}