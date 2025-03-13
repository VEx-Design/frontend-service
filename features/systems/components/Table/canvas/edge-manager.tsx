"use client"

import { useState } from "react"

interface Edge {
  id: string
  source: string
  sourceInterface: string
  target: string
  targetInterface: string
  expectedDistance: number
  actualDistance: number
}

interface EdgeManagerProps {
  edges: Edge[]
  onEdgeUpdate: (edge: Edge) => void
  onEdgeDelete: (edgeId: string) => void
  onEdgeAdd: (edge: Edge) => void
  objects: Array<{
    id: string
    name: string
    interfacePositions: Map<string, [number, number]>
  }>
}

export function EdgeManager({ edges, onEdgeUpdate, onEdgeDelete, onEdgeAdd, objects }: EdgeManagerProps) {
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [newEdgeForm, setNewEdgeForm] = useState({
    source: "",
    sourceInterface: "",
    target: "",
    targetInterface: "",
    expectedDistance: 200,
  })
  const [showNewEdgeForm, setShowNewEdgeForm] = useState(false)

  const handleExpectedDistanceChange = (edgeId: string, value: number) => {
    const edge = edges.find((e) => e.id === edgeId)
    if (edge) {
      onEdgeUpdate({
        ...edge,
        expectedDistance: value,
      })
    }
  }

  const handleNewEdgeSubmit = () => {
    if (newEdgeForm.source && newEdgeForm.sourceInterface && newEdgeForm.target && newEdgeForm.targetInterface) {
      onEdgeAdd({
        id: `edge${Date.now()}`,
        source: newEdgeForm.source,
        sourceInterface: newEdgeForm.sourceInterface,
        target: newEdgeForm.target,
        targetInterface: newEdgeForm.targetInterface,
        expectedDistance: newEdgeForm.expectedDistance,
        actualDistance: 0,
      })
      setShowNewEdgeForm(false)
      setNewEdgeForm({
        source: "",
        sourceInterface: "",
        target: "",
        targetInterface: "",
        expectedDistance: 200,
      })
    }
  }

  return (
    <div className="bg-white p-3 rounded shadow-md">
      <h3 className="font-bold mb-2">Edge Manager</h3>

      <div className="max-h-40 overflow-y-auto">
        {edges.map((edge) => {
          const sourceObj = objects.find((o) => o.id === edge.source)
          const targetObj = objects.find((o) => o.id === edge.target)

          return (
            <div
              key={edge.id}
              className={`p-2 mb-1 rounded cursor-pointer ${
                selectedEdgeId === edge.id ? "bg-blue-100" : "hover:bg-gray-100"
              }`}
              onClick={() => setSelectedEdgeId(edge.id)}
            >
              <div className="flex justify-between">
                <span>
                  {sourceObj?.name || edge.source}.{edge.sourceInterface} → {targetObj?.name || edge.target}.
                  {edge.targetInterface}
                </span>
                <button
                  className="text-red-500 text-xs"
                  onClick={(e) => {
                    e.stopPropagation()
                    onEdgeDelete(edge.id)
                  }}
                >
                  Delete
                </button>
              </div>

              {selectedEdgeId === edge.id && (
                <div className="mt-2">
                  <label className="block text-sm">
                    Expected Distance:
                    <input
                      type="number"
                      value={edge.expectedDistance}
                      onChange={(e) => handleExpectedDistanceChange(edge.id, Number.parseInt(e.target.value))}
                      className="w-full p-1 border rounded mt-1"
                    />
                  </label>
                  <div className="text-sm mt-1">
                    Actual:{" "}
                    <span
                      className={
                        Math.abs(edge.actualDistance - edge.expectedDistance) < 5 ? "text-green-500" : "text-red-500"
                      }
                    >
                      {Math.round(edge.actualDistance)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {showNewEdgeForm ? (
        <div className="mt-2 p-2 border rounded">
          <h4 className="font-semibold text-sm mb-2">New Edge</h4>

          <div className="mb-2">
            <label className="block text-xs">Source Object</label>
            <select
              className="w-full p-1 text-sm border rounded"
              value={newEdgeForm.source}
              onChange={(e) => {
                setNewEdgeForm({
                  ...newEdgeForm,
                  source: e.target.value,
                  sourceInterface: "",
                })
              }}
            >
              <option value="">Select Object</option>
              {objects.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name}
                </option>
              ))}
            </select>
          </div>

          {newEdgeForm.source && (
            <div className="mb-2">
              <label className="block text-xs">Source Interface</label>
              <select
                className="w-full p-1 text-sm border rounded"
                value={newEdgeForm.sourceInterface}
                onChange={(e) => setNewEdgeForm({ ...newEdgeForm, sourceInterface: e.target.value })}
              >
                <option value="">Select Interface</option>
                {objects.find((o) => o.id === newEdgeForm.source)?.interfacePositions &&
                  Array.from(objects.find((o) => o.id === newEdgeForm.source)!.interfacePositions.keys()).map(
                    (intf) => (
                      <option key={intf} value={intf}>
                        {intf}
                      </option>
                    ),
                  )}
              </select>
            </div>
          )}

          <div className="mb-2">
            <label className="block text-xs">Target Object</label>
            <select
              className="w-full p-1 text-sm border rounded"
              value={newEdgeForm.target}
              onChange={(e) => {
                setNewEdgeForm({
                  ...newEdgeForm,
                  target: e.target.value,
                  targetInterface: "",
                })
              }}
            >
              <option value="">Select Object</option>
              {objects
                .filter((obj) => obj.id !== newEdgeForm.source)
                .map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.name}
                  </option>
                ))}
            </select>
          </div>

          {newEdgeForm.target && (
            <div className="mb-2">
              <label className="block text-xs">Target Interface</label>
              <select
                className="w-full p-1 text-sm border rounded"
                value={newEdgeForm.targetInterface}
                onChange={(e) => setNewEdgeForm({ ...newEdgeForm, targetInterface: e.target.value })}
              >
                <option value="">Select Interface</option>
                {objects.find((o) => o.id === newEdgeForm.target)?.interfacePositions &&
                  Array.from(objects.find((o) => o.id === newEdgeForm.target)!.interfacePositions.keys()).map(
                    (intf) => (
                      <option key={intf} value={intf}>
                        {intf}
                      </option>
                    ),
                  )}
              </select>
            </div>
          )}

          <div className="mb-2">
            <label className="block text-xs">Expected Distance</label>
            <input
              type="number"
              className="w-full p-1 text-sm border rounded"
              value={newEdgeForm.expectedDistance}
              onChange={(e) => setNewEdgeForm({ ...newEdgeForm, expectedDistance: Number.parseInt(e.target.value) })}
            />
          </div>

          <div className="flex space-x-2">
            <button
              className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
              onClick={handleNewEdgeSubmit}
              disabled={
                !newEdgeForm.source ||
                !newEdgeForm.sourceInterface ||
                !newEdgeForm.target ||
                !newEdgeForm.targetInterface
              }
            >
              Add Edge
            </button>
            <button
              className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
              onClick={() => setShowNewEdgeForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-2 bg-blue-500 text-white px-2 py-1 rounded text-sm w-full"
          onClick={() => setShowNewEdgeForm(true)}
        >
          Add New Edge
        </button>
      )}
    </div>
  )
}

