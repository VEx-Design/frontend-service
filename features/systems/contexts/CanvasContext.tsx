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

interface CanvasContextValue {
  table: Table;
  setTable: (table: Table) => void;
  objects: Object[];
  setObjects: (objects: Object[]) => void;
  edges: Edge[];
  setEdges: (edges: Edge[]) => void;
}

const CanvasContext = createContext<CanvasContextValue | null>(null);

export const CanvasProvider = (props: { children: React.ReactNode }) => {
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

  return (
    <CanvasContext.Provider
      value={{
        table,
        setTable,
        objects,
        setObjects,
        edges,
        setEdges,
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
