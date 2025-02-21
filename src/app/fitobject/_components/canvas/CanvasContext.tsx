"use client";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

// กำหนดโครงของข้อมูลของ Canvas
interface CanvasType {
  width: number;
  height: number;
  showGrid: boolean;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
  gridStyle: "dot" | "line";
}

// กำหนดค่าเริ่มต้นของ Canvas
const DefaultCanvasType: CanvasType = {
  width: 800,
  height: 600,
  showGrid: true,
  gridSize: 25,
  gridColor: "#CCCCCC",
  gridOpacity: 0.5,
  gridStyle: "dot",
};

interface CanvasObjectType {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  imageUrl: string;
  connectedTo: string[];
  isStartNode?: boolean;
}

interface CanvasState {
  canvas: CanvasType;
  objects: CanvasObjectType[];
  selectedObject: CanvasObjectType | null;
}

// กำหนดโครงร่างของ Canvas Context ที่จะใช้ในการแชร์ไป Component อื่น
interface CanvasContextProps {
  canvasState: CanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
}

// สร้าง Canvas Context สำหรับแชร์ข้อมูลไปยัง Component อื่น ผ่าน Provider ซึ่งเป็น ContextAPI ของ React
const CanvasContext = createContext<CanvasContextProps>({
  canvasState: {
    canvas: DefaultCanvasType,
    objects: [],
    selectedObject: null,
  },
  setCanvasState: () => {},
});

{
  /* 
  สร้าง CanvasProvider สำหรับใช้ครอบ Component ซึ่งจะ return CanvasContext ออกไป
  โดยรับค่า children ที่เป็น ReactNode(JSX, React Compoent) ซึ่งเป็น Component ที่ต้องการใช้ข้อมูลจาก CanvasContext
  สร้าง State สำหรับเก็บข้อมูลของ Canvas โดยการ Check ว่ามีข้อมูลใน LocalStorage หรือไม่ ถ้ามีก็ใช้จาก LocalStorage ถ้าไม่มีก็ใช้ค่า Default
*/
}
export function CanvasProvider({ children }: { children: ReactNode }) {
  const [canvas, setCanvasState] = useState<CanvasState>(getCanvasDimensions());

  useEffect(() => {
    localStorage.setItem("CanvasDimensions", JSON.stringify(canvas));
  }, [canvas]);

  return (
    <CanvasContext.Provider value={{ canvasState: canvas, setCanvasState }}>
      {children}
    </CanvasContext.Provider>
  );
}

// สร้าง Custom Hook สำหรับใช้งานข้อมูลจาก CanvasContext โดยจะ return ค่าของ CanvasContext ออกไป
export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}

// สร้าง Function สำหรับดึงข้อมูลของ Canvas จาก LocalStorage
export function getCanvasDimensions(): CanvasState {
  const dimension = localStorage.getItem("CanvasDimensions");
  return dimension
    ? JSON.parse(dimension)
    : { canvas: DefaultCanvasType, objects: [] };
}

// สร้าง Function สำหรับ Set ขนาดของ Canvas โดยรับค่า width และ height
export function setCanvasDimensions(width: number, height: number): void {
  const LocalStorageCanvas = getCanvasDimensions();
  LocalStorageCanvas.canvas.width = width;
  LocalStorageCanvas.canvas.height = height;
  localStorage.setItem("CanvasDimensions", JSON.stringify(LocalStorageCanvas));
}
