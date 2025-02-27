import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useResizeDetector } from "react-resize-detector";
import { useBox } from "../../contexts/BoxContext";

const Sketch = dynamic(() => import("react-p5"), { ssr: false });

const P5Square = () => {
  const { ref, width = 400, height = 400 } = useResizeDetector();
  const { focusNode, mapBounding } = useBox();

  const [squareSize, setSquareSize] = useState({ width: 0, height: 0 });
  const [relativePos, setRelativePos] = useState<{ x: number; y: number | null }>({ x: 0, y: null });
  const [zoom, setZoom] = useState(1); // Zoom level
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // Panning offset
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (focusNode) {
      const bounding = mapBounding.get(focusNode.id);
      if (bounding) {
        setSquareSize({ width: bounding.width, height: bounding.height });
      } else {
        setSquareSize({ width: 0, height: 0 });
      }
    }
    else{
      setSquareSize({ width: 0, height: 0 });
    }
  }, [focusNode, mapBounding]);

  useEffect(() => {
    if (width > 0 && height > 0) {
      const padding = 0.1; // 10% padding
      const maxWidthZoom = (width * (1 - padding)) / squareSize.width;
      const maxHeightZoom = (height * (1 - padding)) / squareSize.height;
      const newZoom = Math.min(maxWidthZoom, maxHeightZoom, 1);

      setZoom(newZoom);

      // Ensure the square starts centered
      setOffset({
        x: width / 2 - (squareSize.width * newZoom) / 2,
        y: height / 2 - (squareSize.height * newZoom) / 2,
      });
    }
  }, [width, height, squareSize]);

  const setup = (p5: any, canvasParentRef: any) => {
    p5.createCanvas(width, height).parent(canvasParentRef);
  };

  const draw = (p5: any) => {
    p5.resizeCanvas(width, height);
    p5.background(220);

    p5.push();
    p5.translate(offset.x, offset.y); // Apply panning
    p5.scale(zoom);

    // Draw the square
    p5.fill(100, 200, 255);
    p5.rect(0, 0, squareSize.width, squareSize.height);

    p5.pop();

    // Display relative coordinates if inside the square
    if (relativePos.y !== null) {
      p5.fill(0);
      p5.textSize(16);
      p5.text(`(${relativePos.x}, ${relativePos.y})`, p5.mouseX, p5.mouseY - 10);
    }
  };

  const mouseMoved = (p5: any) => {
    // Convert mouse position to unscaled coordinates
    const unscaledX = (p5.mouseX - offset.x) / zoom;
    const unscaledY = (p5.mouseY - offset.y) / zoom;

    if (
      unscaledX >= 0 &&
      unscaledX <= squareSize.width &&
      unscaledY >= 0 &&
      unscaledY <= squareSize.height
    ) {
      setRelativePos({
        x: Math.floor(unscaledX),
        y: Math.floor(unscaledY),
      });
    } else {
      setRelativePos({ x: 0, y: null });
    }
  };

  const mousePressed = (p5: any) => {
    setIsDragging(true);
    setLastMouse({ x: p5.mouseX, y: p5.mouseY });
  };

  const mouseReleased = () => {
    setIsDragging(false);
  };

  const mouseDragged = (p5: any) => {
    if (isDragging) {
      const dx = p5.mouseX - lastMouse.x;
      const dy = p5.mouseY - lastMouse.y;
      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      setLastMouse({ x: p5.mouseX, y: p5.mouseY });
    }
  };

  const mouseWheel = (p5: any, event: any) => {
    event.preventDefault();
    let newZoom = zoom - event.delta * 0.001;
    newZoom = p5.constrain(newZoom, 0.3, 2); // Keep zoom within limits

    // Get mouse position before zooming
    const mouseXBeforeZoom = (p5.mouseX - offset.x) / zoom;
    const mouseYBeforeZoom = (p5.mouseY - offset.y) / zoom;

    // Update zoom
    setZoom(newZoom);

    // Adjust offset so that zooming is centered on the mouse
    setOffset((prev) => ({
      x: p5.mouseX - mouseXBeforeZoom * newZoom,
      y: p5.mouseY - mouseYBeforeZoom * newZoom,
    }));
  };

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <Sketch
        setup={setup}
        draw={draw}
        mouseMoved={mouseMoved}
        mousePressed={mousePressed}
        mouseReleased={mouseReleased}
        mouseDragged={mouseDragged}
        mouseWheel={mouseWheel}
      />
    </div>
  );
};

export default P5Square;
