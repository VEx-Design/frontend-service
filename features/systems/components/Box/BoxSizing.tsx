import type React from "react"
import { useEffect, useState } from "react"
import { useBox } from "../../contexts/BoxContext"
import { BoundingConfiguration } from "../../libs/ClassBox/types/BoundingConfiguration"
import { useProject } from "../../contexts/ProjectContext"
import { Check, ChevronDown, Focus, ArrowDownToDotIcon } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function BoxSizing() {
  const { mapBounding, setMapBounding } = useProject() as {
    mapBounding: Map<string, BoundingConfiguration>
    setMapBounding: React.Dispatch<React.SetStateAction<Map<string, BoundingConfiguration>>>
    blueprint: Map<string, BoundingConfiguration[]>
    setBlueprint: React.Dispatch<React.SetStateAction<Map<string, BoundingConfiguration[]>>>
  }
  const { focusNode, focusPoint, setFocusPoint, config, nodesState } = useBox()
  const [height, setHeight] = useState("")
  const [width, setWidth] = useState("")
  const [interfaces, setInterfaces] = useState<[string, string][]>([])
  const [showSaveHeight, setShowSaveHeight] = useState(false)
  const [showSaveWidth, setShowSaveWidth] = useState(false)

  useEffect(() => {
    setFocusPoint("")
    if (!focusNode) {
      setHeight("")
      setWidth("")
      setInterfaces([])
      setShowSaveHeight(false)
      setShowSaveWidth(false)
      return
    }

    const nodeInfo = mapBounding.get(focusNode.id)
    if (nodeInfo) {
      setHeight(nodeInfo.height.toString())
      setWidth(nodeInfo.width.toString())
    } else {
      setHeight("")
      setWidth("")
    }

    const nodeId = focusNode.id
    const node = nodesState.nodes.find((node) => node.id === nodeId)
    if (node?.type === "ObjectNode") {
      const typeID = node?.data.data.object?.typeId
      const interfaces = config.types.find((type) => type.id === typeID)?.interfaces
      if (interfaces) {
        setInterfaces(interfaces.map((intf) => [intf.id, intf.name]))
      } else {
        setInterfaces([])
      }
    } else if (node?.type === "starter") {
      setInterfaces([["starter", "Output"]])
    } else {
      setInterfaces([["terminal", "Input"]])
    }

    setShowSaveHeight(false)
    setShowSaveWidth(false)
  }, [focusNode, mapBounding, config.types, nodesState.nodes, setFocusPoint])

  const handleSave = () => {
    if (!focusNode) return

    const prevMap = mapBounding
    const existingConfig: BoundingConfiguration | undefined = prevMap.get(focusNode.id)
    let newHeight: number = Number(height) || 0
    let newWidth: number = Number(width) || 0

    // Ensure height and width do not exceed 1000
    if (newHeight > 1000) newHeight = 1000
    if (newWidth > 1000) newWidth = 1000

    const referencePoint = existingConfig?.referencePosition || [0.5, 0.5]
    const interfacePositions = existingConfig?.interfacePositions || new Map()

    if (!(existingConfig?.height === newHeight && existingConfig?.width === newWidth)) {
      const updatedMap: Map<string, BoundingConfiguration> = new Map(prevMap)
      updatedMap.set(
        focusNode.id,
        new BoundingConfiguration("", newHeight, newWidth, referencePoint, interfacePositions),
      )
      setMapBounding(updatedMap)
    }

    setShowSaveHeight(false)
    setShowSaveWidth(false)
  }

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeight(e.target.value)
    setShowSaveHeight(true)
  }

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidth(e.target.value)
    setShowSaveWidth(true)
  }

  const setPoint = (type: "reference" | "interface", id: string, point: [number, number]) => {
    if (!focusNode) return
    setMapBounding((prev) => {
      const newMapBounding = new Map(prev)
      const nodeInfo = newMapBounding.get(focusNode.id)
      if (nodeInfo) {
        if (type === "reference") {
          newMapBounding.set(
            focusNode.id,
            new BoundingConfiguration(
              nodeInfo.name,
              nodeInfo.height,
              nodeInfo.width,
              point,
              nodeInfo.interfacePositions,
            ),
          )
        } else if (type === "interface") {
          const newInterfacePositions = new Map(nodeInfo.interfacePositions)
          newInterfacePositions.set(id, point)
          newMapBounding.set(
            focusNode.id,
            new BoundingConfiguration(
              nodeInfo.name,
              nodeInfo.height,
              nodeInfo.width,
              nodeInfo.referencePosition,
              newInterfacePositions,
            ),
          )
        }
      }
      return newMapBounding
    })
  }

  const setReferencePoint = (point: [number, number]) => {
    setPoint("reference", "", point)
  }

  const setInterfacePoint = (intf: string, point: [number, number]) => {
    setPoint("interface", intf, point)
  }

  const setAllInterfaceMiddleCenter = () => {
    if (!focusNode) return
    const nodeInfo = mapBounding.get(focusNode.id)
    if (!nodeInfo) return

    setMapBounding((prev) => {
      const newMapBounding = new Map(prev)
      const newInterfacePositions = new Map<string, [number, number]>()

      interfaces.forEach((intf) => {
        newInterfacePositions.set(intf[0], [0.5, 0.5])
      })

      newMapBounding.set(
        focusNode.id,
        new BoundingConfiguration(nodeInfo.name, nodeInfo.height, nodeInfo.width, [0.5, 0.5], newInterfacePositions),
      )

      return newMapBounding
    })
  }

  const setAllNodesDefault = () => {
    const nodes = nodesState.nodes

    nodes.forEach((node) => {
      if (!node) return

      const nodeInfo = mapBounding.get(node.id)
      if (!nodeInfo) return

      const newInterfacePositions = new Map<string, [number, number]>()

      if (node.type === "ObjectNode") {
        const typeID = node?.data?.data?.object?.typeId
        const interfaces = config.types.find((type) => type.id === typeID)?.interfaces

        if (interfaces) {
          interfaces.forEach((intf) => {
            newInterfacePositions.set(intf.id, [0.5, 0.5])
          })
        }
      } else if (node.type === "starter") {
        newInterfacePositions.set("starter", [0.5, 0.5])
      } else {
        newInterfacePositions.set("terminal", [0.5, 0.5])
      }

      setMapBounding((prev) => {
        const newMapBounding = new Map(prev)
        newMapBounding.set(
          node.id,
          new BoundingConfiguration(nodeInfo.name, nodeInfo.height, nodeInfo.width, [0.5, 0.5], newInterfacePositions),
        )
        return newMapBounding
      })
    })
  }

  const ReferencePointActions = [
    { label: "Top Left", action: () => setReferencePoint([0, 0]) },
    { label: "Top Center", action: () => setReferencePoint([0.5, 0]) },
    { label: "Top Right", action: () => setReferencePoint([1, 0]) },
    { label: "Middle Left", action: () => setReferencePoint([0, 0.5]) },
    { label: "Middle Center", action: () => setReferencePoint([0.5, 0.5]) },
    { label: "Middle Right", action: () => setReferencePoint([1, 0.5]) },
    { label: "Bottom Left", action: () => setReferencePoint([0, 1]) },
    { label: "Bottom Center", action: () => setReferencePoint([0.5, 1]) },
    { label: "Bottom Right", action: () => setReferencePoint([1, 1]) },
    { label: "Manual", action: () => setFocusPoint("Reference Point") },
  ]

  const InterfacePointActions = (intfId: string) => [
    { label: "Top Left", action: () => setInterfacePoint(intfId, [0, 0]) },
    { label: "Top Center", action: () => setInterfacePoint(intfId, [0.5, 0]) },
    { label: "Top Right", action: () => setInterfacePoint(intfId, [1, 0]) },
    { label: "Middle Left", action: () => setInterfacePoint(intfId, [0, 0.5]) },
    { label: "Middle Center", action: () => setInterfacePoint(intfId, [0.5, 0.5]) },
    { label: "Middle Right", action: () => setInterfacePoint(intfId, [1, 0.5]) },
    { label: "Bottom Left", action: () => setInterfacePoint(intfId, [0, 1]) },
    { label: "Bottom Center", action: () => setInterfacePoint(intfId, [0.5, 1]) },
    { label: "Bottom Right", action: () => setInterfacePoint(intfId, [1, 1]) },
    { label: "Manual", action: () => setFocusPoint(intfId) },
  ]

  return (
    <div className="h-full overflow-auto" onClick={() => setFocusPoint("")}>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Boundnig Configuration</CardTitle>
            <Button variant="outline" size="sm" onClick={setAllNodesDefault} className="flex items-center gap-1">
              <ArrowDownToDotIcon className="h-4 w-4" />
             Apply  <strong>Center Interfaces </strong> to <strong>All Nodes</strong>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {focusNode ? (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Dimensions</h3>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={setAllInterfaceMiddleCenter}
                    className="flex items-center gap-1"
                  >
                    <Focus className="h-3 w-3" />
                    <strong>Center Interfaces</strong>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="width" className="text-sm font-medium">
                      Width (mm)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={handleWidthChange}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full"
                      />
                      {showSaveWidth && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSave()
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Save width</span>
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="height" className="text-sm font-medium">
                      Height (mm)
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={handleHeightChange}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full"
                      />
                      {showSaveHeight && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-500"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSave()
                          }}
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Save height</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                <h2 className="text-medium font-bold">Reference Point</h2>
                  {focusPoint === "Reference Point" && (
                    <Badge variant="outline" className="bg-red-50">
                      Selecting
                    </Badge>
                  )}
                </div>

                <DropdownMenuComponent
                  label="Set Reference Point"
                  actions={ReferencePointActions}
                  dropdownId="reference"
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-medium font-bold">Interfaces</h2>
                <div className="grid gap-3">
      {interfaces.map((intf, index) => (
        <div key={`${intf[0]}-${index}`} className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`${focusPoint === intf[0] ? "font-bold text-primary text-sm" : "text-sm"}`}>{intf[1]}</span>
            {focusPoint === intf[0] && (
              <Badge variant="outline" className="bg-green-50">
                Selecting
              </Badge>
            )}
          </div>
          <DropdownMenuComponent
            label="Set Position"
            actions={InterfacePointActions(intf[0])}
            dropdownId={`interface-${intf[0]}`}
          />
        </div>
      ))}
    </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-md">
              <p>Select a node to configure its dimensions and connection points</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface DropdownMenuComponentProps {
  label: string
  actions: { label: string; action: () => void }[]
  dropdownId: string
}

function DropdownMenuComponent({ label, actions, dropdownId }: DropdownMenuComponentProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center justify-between">
          {label}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {actions.slice(0, -1).map((action, index) => (
          <DropdownMenuItem
            key={`${dropdownId}-${index}`}
            onClick={(e) => {
              e.stopPropagation()
              action.action()
            }}
          >
            {action.label}
          </DropdownMenuItem>
        ))}
        {actions.length > 1 && <DropdownMenuSeparator />}
        {actions.length > 0 && (
          <DropdownMenuItem
            key={`${dropdownId}-manual`}
            onClick={(e) => {
              e.stopPropagation()
              actions[actions.length - 1].action()
            }}
            className="text-primary font-medium"
          >
            {actions[actions.length - 1].label}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

