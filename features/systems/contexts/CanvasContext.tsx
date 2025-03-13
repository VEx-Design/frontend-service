import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { Table } from "../components/Table/Class/table";
import { Object } from "../components/Table/Class/object";
import { Edge } from "../components/Table/Class/edge";
import { Mirror } from "../components/Table/Class/mirror";

interface CanvasContextValue {
  //Stage size
  stageSize: { width: number; height: number };
  setStageSize: (stageSize: { width: number; height: number }) => void;

  // Table and objects
  table: Table;
  setTable: (table: Table) => void;
  objects: Object[];
  setObjects: (objects: Object[]) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
  mirrors: Mirror[];
  setMirrors: (mirrors: Mirror[]) => void;
  defaultMirror: number;
  setDefaultMirror: (defaultMirror: number) => void;

  // SCENE COORDINATE APPROACH: Zoom and position state
  scale: number;
  setScale: (scale: number) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;

  // Object selection
  selectedObjectId: string | null;
  setSelectedObjectId: (id: string | null) => void;

  //Snap grid function
  snapPoints: { x: number; y: number }[];
  setSnapPoints: (snapPoints: { x: number; y: number }[]) => void;
  snapEnabled: boolean;
  setSnapEnabled: (snapEnabled: boolean) => void;
  snapThreshold: number;
  setSnapThreshold: (snapThreshold: number) => void;

  //Track Dragging Object
  draggingObjectId: string | null;
  setDraggingObjectId: (id: string | null) => void;
  isDraggingObject: boolean;
  setIsDraggingObject: (isDraggingObject: boolean) => void;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export const CanvasProvider = (props: { children: React.ReactNode }) => {
  //Stage size state
  const [stageSize, setStageSize] = useState<{ width: number; height: number }>(
    {
      width: 800,
      height: 600,
    }
  );

  //Table and objects state
  const [table, setTable] = useState<Table>({
    size: { width: 2500, height: 1000 },
    margin: { width: 50, height: 50 },
    gridDistance: 25,
    gridStyle: "dot",
    gridColor: "black",
    gridOpacity: 0.5,
  });
  const [objects, setObjects] = useState<Object[]>([
    {
      id: "1",
      name: "Laser Generator",
      size: { width: 50, height: 50 },
      position: { x: 0, y: 0 },
      rotation: 0,
      referencePosition: [0.5, 0.5],
      interfacePositions: new Map([["start", [0.5, 0.5]]]),
      isColliding: false,
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    {
      id: "2",
      name: "Lens",
      size: { width: 50, height: 50 },
      position: { x: 50, y: 50 },
      rotation: 0,
      referencePosition: [0.5, 0.5],
      interfacePositions: new Map([
        ["1", [0.5, 0.5]],
        ["2", [0.5, 0.5]],
      ]),
      isColliding: false,
      imageUrl: "/images/lens.png",
    },
    {
      id: "3",
      name: "Detector",
      size: { width: 50, height: 50 },
      position: { x: 100, y: 100 },
      rotation: 0,
      referencePosition: [0.5, 0.5],
      interfacePositions: new Map([["terminal", [0.5, 0.5]]]),
      isColliding: false,
    },
  ]);
  const [edges, setEdges] = useState<Edge[]>([
    {
      id: "edge1",
      source: "1",
      sourceInterface: "start",
      target: "2",
      targetInterface: "1",
      expectedDistance: 200,
      actualDistance: 0,
    },
    {
      id: "edge2",
      source: "2",
      sourceInterface: "2",
      target: "3",
      targetInterface: "terminal",
      expectedDistance: 200,
      actualDistance: 0,
    },
  ]);
  const [mirrors, setMirrors] = useState<Mirror[]>([
    {
      name: "Small",
      width: 20,
      height: 20,
      imageUrl:
        "https://images.squarespace-cdn.com/content/v1/54822a56e4b0b30bd821480c/45ed8ecf-0bb2-4e34-8fcf-624db47c43c8/Golden+Retrievers+dans+pet+care.jpeg",
    },
    { name: "Medium", width: 30, height: 30 },
    { name: "Large", width: 40, height: 40 },
  ]);
  const [defaultMirror, setDefaultMirror] = useState<number>(0);

  //State for handling zoom and position
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  //State for object selection
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);

  //State for snap grid
  const [snapPoints, setSnapPoints] = useState<{ x: number; y: number }[]>([]);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [snapThreshold, setSnapThreshold] = useState(10);

  //State for dragging object
  const [draggingObjectId, setDraggingObjectId] = useState<string | null>(null);
  const [isDraggingObject, setIsDraggingObject] = useState(false);

  return (
    <CanvasContext.Provider
      value={{
        stageSize,
        setStageSize,
        table,
        setTable,
        objects,
        setObjects,
        edges,
        setEdges,
        mirrors,
        setMirrors,
        defaultMirror,
        setDefaultMirror,
        scale,
        setScale,
        position,
        setPosition,
        selectedObjectId,
        setSelectedObjectId,
        snapPoints,
        setSnapPoints,
        snapEnabled,
        setSnapEnabled,
        snapThreshold,
        setSnapThreshold,
        draggingObjectId,
        setDraggingObjectId,
        isDraggingObject,
        setIsDraggingObject,
      }}
    >
      {props.children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
};
