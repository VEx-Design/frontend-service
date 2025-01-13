import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Stage, Layer, Rect } from "react-konva";

const MAX_WIDTH = 800; // ขนาดกรอบสูงสุด
const MAX_HEIGHT = 600; // ขนาดกรอบสูงสุด

const Canvas = () => {
  const searchParams = useSearchParams();

  const inputWidth = Number(searchParams.get("width"));
  const inputHeight = Number(searchParams.get("height"));

  // คำนวณสเกลที่เหมาะสมเพื่อ FitMaxSpace
  const scaleWidth = MAX_WIDTH / inputWidth;
  const scaleHeight = MAX_HEIGHT / inputHeight;
  const scale = Math.min(scaleWidth, scaleHeight, 1); // เลือกสเกลที่เล็กที่สุด แต่ไม่ขยายเกินขนาดที่กำหนดไว้

  // ขนาด Stage หลังปรับสเกล
  const stageWidth = inputWidth * scale;
  const stageHeight = inputHeight * scale;

  // สร้าง state สำหรับการซูมเพิ่มเติม
  const [zoomScale, setZoomScale] = useState(1);

  // ฟังก์ชันซูมอินและซูมเอาท์
  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev * 1.2, 5));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(prev / 1.2, 1));

  // ฟังก์ชันจัดการการหมุนเมาส์เพื่อซูม
  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const newScale =
      e.evt.deltaY > 0 ? zoomScale / scaleBy : zoomScale * scaleBy;
    setZoomScale(Math.max(Math.min(newScale, 5), 1));
  };

  // ฟังก์ชันจัดการตำแหน่งลากวัตถุ
  const handleDragMove = (e: any) => {
    const rect = e.target;
    const rectWidth = rect.width();
    const rectHeight = rect.height();
    const x = Math.max(0, Math.min(rect.x(), stageWidth - rectWidth));
    const y = Math.max(0, Math.min(rect.y(), stageHeight - rectHeight));
    rect.position({ x, y });
  };

  return (
    <div className="h-full flex justify-center items-center relative">
      <Stage
        width={stageWidth}
        height={stageHeight}
        scaleX={zoomScale}
        scaleY={zoomScale}
        className="border border-gray-300 bg-yellow-100"
        onWheel={handleWheel}
      >
        <Layer>
          <Rect
            x={10 * scale}
            y={10 * scale}
            width={50 * scale}
            height={50 * scale}
            fill="blue"
            draggable
            onDragMove={handleDragMove}
          />
          <Rect
            x={100 * scale}
            y={100 * scale}
            width={100 * scale}
            height={150 * scale}
            fill="red"
            draggable
            onDragMove={handleDragMove}
          />
        </Layer>
      </Stage>

      {/* ปุ่มสำหรับซูม */}
      <div className="absolute bottom-0 right-50%">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-blue-500 text-white rounded m-2"
        >
          Zoom In
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-red-500 text-white rounded m-2"
        >
          Zoom Out
        </button>
      </div>
    </div>
  );
};

export default Canvas;
