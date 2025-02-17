import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface CanvasState {
  width: number;
  height: number;
  showGrid: boolean;
  gridSize: number;
  gridColor: string;
  gridOpacity: number;
  gridStyle: "dot" | "line";
}

interface CanvasContextType {
  canvasState: CanvasState;
  setCanvasState: React.Dispatch<React.SetStateAction<CanvasState>>;
}

const defaultCanvasState: CanvasState = {
  width: 800,
  height: 600,
  showGrid: true,
  gridSize: 25,
  gridColor: "#CCCCCC",
  gridOpacity: 0.5,
  gridStyle: "dot",
};

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, otherwise use defaults
  const [canvasState, setCanvasState] = useState<CanvasState>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("canvasState");
      if (saved) {
        const parsedState = JSON.parse(saved);
        // Merge saved state with default state to ensure all properties exist
        return {
          ...defaultCanvasState,
          ...parsedState,
        };
      }
    }
    return defaultCanvasState;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("canvasState", JSON.stringify(canvasState));
  }, [canvasState]);

  return (
    <CanvasContext.Provider value={{ canvasState, setCanvasState }}>
      {children}
    </CanvasContext.Provider>
  );
}

export function useCanvas() {
  const context = useContext(CanvasContext);
  if (context === undefined) {
    throw new Error("useCanvas must be used within a CanvasProvider");
  }
  return context;
}

// Helper function for pages that don't need the context
export function getCanvasDimensions(): CanvasState {
  if (typeof window === "undefined") {
    return defaultCanvasState; // Default values for SSR
  }
  const saved = localStorage.getItem("canvasState");
  return saved
    ? { ...defaultCanvasState, ...JSON.parse(saved) }
    : defaultCanvasState;
}

export function setCanvasDimensions(width: number, height: number): void {
  const currentState = getCanvasDimensions();
  const newState = { ...currentState, width, height };
  localStorage.setItem("canvasState", JSON.stringify(newState));
}
