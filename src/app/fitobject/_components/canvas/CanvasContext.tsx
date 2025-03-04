import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from "react"

// Define Types
interface ObjectProps {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  fill: string
  imageUrl: string
  referencePosition: [number, number]
  rotation?: number
  interfacePositions?: Map<string, [number, number]>
}

interface GridProps {
  showGrid: boolean
  gridSize: number
  gridColor: string
  gridOpacity: number
  gridStyle: "dot" | "line"
}

interface CanvasState {
  objects: ObjectProps[]
  selectedObjectId: string | null
  canvasWidth: number
  canvasHeight: number
  grid: GridProps
}

interface CanvasContextType {
  // Canvas state
  canvas: CanvasState
  // Canvas methods
  setCanvasSize: (width: number, height: number) => void
  setGrid: (settings: Partial<GridProps>) => void
  updateCanvas: (updates: Partial<CanvasState>) => void

  // Object methods
  selectObject: (id: string | null) => void
  getSelectedObject: () => ObjectProps | null
  updateObject: (id: string, updates: Partial<ObjectProps>) => void
}

interface CanvasProviderProps {
  children: ReactNode
  initialObjects: ObjectProps[]
  initialCanvasSize: { width: number; height: number }
}

const CanvasContext = createContext<CanvasContextType | null>(null)

export const CanvasProvider = ({ children, initialObjects, initialCanvasSize }: CanvasProviderProps) => {
  const [canvas, setCanvas] = useState<CanvasState>({
    objects: initialObjects,
    selectedObjectId: null,
    canvasWidth: initialCanvasSize?.width,
    canvasHeight: initialCanvasSize?.height,
    grid: {
      showGrid: true,
      gridSize: 25,
      gridColor: "#CCCCCC",
      gridOpacity: 1,
      gridStyle: "dot",
    },
  })

  useEffect(() => {
    setCanvas((prev) => ({
      ...prev,
      objects: initialObjects,
    }))
  }, [initialObjects])

  const setCanvasSize = useCallback((width: number, height: number) => {
    setCanvas((prev) => {
      return {
        ...prev,
        canvasWidth: width,
        canvasHeight: height,
      }
    })
  }, [])

  const setGrid = useCallback((settings: Partial<GridProps>) => {
    setCanvas((prev) => ({
      ...prev,
      grid: {
        ...prev.grid,
        ...settings,
      },
    }))
  }, [])

  const selectObject = useCallback((id: string | null) => {
    setCanvas((prev) => ({
      ...prev,
      selectedObjectId: id,
    }))
  }, [])

  const getSelectedObject = useCallback(() => {
    return canvas.objects.find((obj) => obj.id === canvas.selectedObjectId) || null
  }, [canvas.objects, canvas.selectedObjectId])

  const updateObject = useCallback((id: string, updates: Partial<ObjectProps>) => {
    setCanvas((prev) => ({
      ...prev,
      objects: prev.objects.map((obj) => (obj.id === id ? { ...obj, ...updates } : obj)),
    }))
  }, [])

  const updateCanvas = useCallback((updates: Partial<CanvasState>) => {
    setCanvas((prev) => ({
      ...prev,
      ...updates,
    }))
  }, [])

  const contextValue: CanvasContextType = {
    canvas,
    setCanvasSize,
    setGrid,
    selectObject,
    getSelectedObject,
    updateObject,
    updateCanvas,
  }

  return <CanvasContext.Provider value={contextValue}>{children}</CanvasContext.Provider>
}

export const useCanvas = () => {
  const context = useContext(CanvasContext)
  if (!context) {
    throw new Error("useCanvas must be used within a CanvasProvider")
  }
  return context
}

