import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
  use,
} from "react";
import { Table } from "../components/Table/Class/table";
import { Object } from "../components/Table/Class/object";
import { Edge } from "../components/Table/Class/edge";
import { Mirror } from "../components/Table/Class/mirror";
import { useNodesState } from "@xyflow/react";
import { useConfig } from "./ProjectWrapper/ConfigContext";
import { useNodes } from "./ProjectWrapper/NodesContext";
import { useEdges } from "./ProjectWrapper/EdgesContext";

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
  const { mapBounding } = useConfig();
  const nodesState = useNodes();
  const edgesState = useEdges();
  const { config } = useConfig();

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

  const [objects, setObjects] = useState<Object[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [mirrors, setMirrors] = useState<Mirror[]>([
    {
      name: "Mirror 1",
      width: 50,
      height: 50,
      imageUrl: "",
    },
    {
      name: "Mirror 2",
      width: 100,
      height: 100,
      imageUrl: "",
    },
    {
      name: "Mirror 3",
      width: 150,
      height: 150,
      imageUrl: "",
    },
  ]);
  const [defaultMirror, setDefaultMirror] = useState<number>(1);

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

  //mirrors

  function extractUUID(input: string): string {
    return input.replace(/^(source-handle-|target-handle-)/, "");
  }

  useEffect(() => {
    const objects = mapBounding.entries();
    const newObjects: Object[] = [];
    let moveDistance = 0;
    for (const [id, bounding] of objects) {
      const node = nodesState.nodes.find((node) => node.id === id);
      const name =
        node?.data.data.object?.name ||
        (node?.type === "starter" ? "Starter" : "Terminal");
      const image =
        config.types.find((type) => type.id === node?.data.data.object?.typeId)
          ?.picture || "";
      newObjects.push({
        id: id,
        name: name,
        size: { width: bounding.width, height: bounding.height },
        position: { x: moveDistance, y: 0 },
        rotation: 0,
        referencePosition: bounding.referencePosition,
        interfacePositions: bounding.interfacePositions,
        imageUrl: image,
        isColliding: false,
        isMirror: false,
      });
      moveDistance += bounding.width + 30;
    }
    setObjects(newObjects);

    const newEdges: Edge[] = [];
    for (const edge of edgesState.edges) {
      newEdges.push({
        id: edge.id,
        source: edge.source,
        sourceInterface: edge.sourceHandle
          ? extractUUID(edge.sourceHandle)
          : "",
        target: edge.target,
        targetInterface: edge.targetHandle
          ? extractUUID(edge.targetHandle)
          : "",
        expectedDistance: +(edge?.data?.data?.distance ?? 0),
        actualDistance: 0,
      });
    }
    const uniqueEdges = newEdges.filter(
      (edge, index, self) =>
        index ===
        self.findIndex(
          (e) =>
            e.source === edge.source &&
            e.sourceInterface === edge.sourceInterface &&
            e.target === edge.target &&
            e.targetInterface === edge.targetInterface
        )
    );
    setEdges(uniqueEdges);
  }, [mapBounding, nodesState.nodes, edgesState.edges]);

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
