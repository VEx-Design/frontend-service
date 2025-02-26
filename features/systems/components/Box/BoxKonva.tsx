import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useResizeDetector } from 'react-resize-detector';
import { Layer, Rect, Stage } from 'react-konva';
import { useBox } from '../../contexts/BoxContext';

export default function BoxKonva() {
  const { ref, height, width } = useResizeDetector();
  const {focusNode, mapBounding} = useBox();
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [middle, setMiddle] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: -1, y: -1 });
  const [squareSize, setSquareSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (height && width) {
      setStageSize({ width: width, height: height });
      setMiddle({ x: width / 2, y: height / 2 });
    }
  }, [height, width]);

  useEffect(() => {
    if (focusNode) {
      const bounding = mapBounding.get(focusNode.id);
      if (bounding) {
        setSquareSize({ width: bounding.width, height: bounding.height });
      }
      else{
        setSquareSize({ width: 0, height: 0 });
      }
    }
  }, [focusNode, mapBounding]);

  const handleMouseMoveStage = (e: any) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    if (pointerPosition && focusNode && squareSize.width > 0 && squareSize.height > 0) {
        const rectX = middle.x - squareSize.width / 2;
        const rectY = middle.y - squareSize.height / 2;

        if (
            pointerPosition.x >= rectX &&
            pointerPosition.x <= rectX + squareSize.width &&
            pointerPosition.y >= rectY &&
            pointerPosition.y <= rectY + squareSize.height
        ) {
            setMousePosition({ x: pointerPosition.x, y: pointerPosition.y });
        } else {
            setMousePosition({ x: -1, y: -1 }); 
        }
    } else {
        setMousePosition({ x: -1, y: -1 }); 
    }
};

  const handleMouseLeaveStage = () => {
    setMousePosition({ x: -1, y: -1 });
};


  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <div>({mousePosition.x === -1 ? "-" : mousePosition.x}, {mousePosition.y === -1 ? "-" : mousePosition.y})</div>
      {(stageSize.width && stageSize.height) && (
        <Stage width={stageSize.width} height={stageSize.height}  
          onMouseMove={handleMouseMoveStage}  
          onMouseLeave={handleMouseLeaveStage}
        >
          <Layer >
           { (focusNode) && 
           <Rect
              x = {middle.x}
              y = {middle.y}
              offsetX={squareSize.width / 2}
              offsetY={squareSize.height / 2}
              width={squareSize.width}
              height={squareSize.height}
              fill="red"
            />
            }
          </Layer>
        </Stage>
      )}
    </div>
  )
}