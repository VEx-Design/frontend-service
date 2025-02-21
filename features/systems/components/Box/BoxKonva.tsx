import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Line } from "react-konva";
import { useBox } from "../../contexts/BoxContext";

const Grid = ({ width, height, scale }) => {
  const gridSize = 10;
  const lines = [];

  for (let i = -width; i < width; i += gridSize) {
    lines.push(
      <Line
        key={`v-${i}`}
        points={[i, -height, i, height]}
        stroke={i === 0 ? "red" : "#ddd"}
        strokeWidth={i === 0 ? 2 / scale : 1 / scale}
      />
    );
  }

  for (let i = -height; i < height; i += gridSize) {
    lines.push(
      <Line
        key={`h-${i}`}
        points={[-width, i, width, i]}
        stroke={i === 0 ? "red" : "#ddd"}
        strokeWidth={i === 0 ? 2 / scale : 1 / scale}
      />
    );
  }

  return <>{lines}</>;
};

export default function BoxKonva() {
  const { focusNode, map } = useBox();
  const { nodesState } = useBox();
  const { config } = useBox();
  const [intf, setIntf] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rectDimensions, setRectDimensions] = useState({ width: 100, height: 100 });
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
        setPosition({
          x: containerRef.current.clientWidth / 2,
          y: containerRef.current.clientHeight / 2,
        });
      }
    };

    handleResize(); // Set initial dimensions and position
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (focusNode) {
      const typeID = nodesState.nodes.find(node => node.id === focusNode?.id)?.data.data.object?.typeId;
      const number = config.types.find(type => type.id === typeID)?.interfaces.length;
      setIntf(number || 0);
    } else {
      setIntf(0);
    }
  }, [focusNode, nodesState.nodes, config.types]);

  useEffect(() => {
    if (focusNode) {
      const nodeInfo = map.get(focusNode.id);
      if (nodeInfo) {
        setRectDimensions({
          width: nodeInfo.width,
          height: nodeInfo.height,
        });
        setPosition({
          x: dimensions.width / 2,
          y: dimensions.height / 2,
        }); // Reset position when focus node changes
      } else {
        setRectDimensions({ width: 0, height: 0 });
      }
    }
  }, [focusNode, map, dimensions.width, dimensions.height]);

  useEffect(() => {
    setMousePosition({ x: 0, y: 0 });
  }, [focusNode]);

  const handleWheel = (e: { evt: { preventDefault: () => void; deltaY: number; }; target: { getStage: () => any; }; }) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;
    setScale(newScale);

    stage.scale({ x: newScale, y: newScale });
    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    };
    setPosition(newPos);
    stage.position(newPos);
    stage.batchDraw();
  };

  const handleDragMove = (e: { target: { x: () => any; y: () => any; }; }) => {
    setPosition({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  const handleMouseMove = (e: { evt: { offsetX: number; offsetY: number; }; }) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    const transformedPosition = {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY(),
    };
    setMousePosition(transformedPosition);
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
        scaleX={scale}
        scaleY={scale}
        x={position.x}
        y={position.y}
        draggable
        onWheel={handleWheel}
        onDragMove={handleDragMove}
        onMouseMove={handleMouseMove}
      >
        <Layer>
          <Grid width={dimensions.width} height={dimensions.height} scale={scale} />
          {focusNode && rectDimensions.width > 0 && rectDimensions.height > 0 && (
            <Rect
              x={-rectDimensions.width / 2}
              y={-rectDimensions.height / 2}
              width={rectDimensions.width}
              height={rectDimensions.height}
              fill="grey"
              draggable
            />
          )}
          <Text
            text={`x: ${mousePosition.x.toFixed(2)}, y: ${mousePosition.y.toFixed(2)}`}
            x={10}
            y={10}
            fontSize={16}
            fill="black"
          />
        </Layer>
      </Stage>
    </div>
  );
}