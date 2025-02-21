import React, { useEffect, useRef, useState } from "react";
import { Stage, Layer, Rect } from "react-konva";
import { useBox } from "../../contexts/BoxContext";

export default function BoxKonva() {
  const { focusNode, map } = useBox();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [rectDimensions, setRectDimensions] = useState({ width: 100, height: 100 });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (focusNode) {
      const nodeInfo = map.get(focusNode.id);
      if (nodeInfo) {
        setRectDimensions({
          width: nodeInfo.width,
          height: nodeInfo.height,
        });
      }
    }
  }, [focusNode, map]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", position: "relative" }}>
      <Stage
        width={dimensions.width}
        height={dimensions.height}
      >
        <Layer>
         
            <Rect
              x={(dimensions.width - rectDimensions.width) / 2}
              y={(dimensions.height - rectDimensions.height) / 2}
              width={rectDimensions.width}
              height={rectDimensions.height}
              fill="blue"
              draggable
            />
          
        </Layer>
      </Stage>
    </div>
  );
}