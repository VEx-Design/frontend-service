import React, { useContext, useState } from "react";
import { PyramidIcon, TrashIcon } from "lucide-react";
import Input from "../Input";
import { editObjectValueById } from "../../libs/editObjectDetail";
import { EditorContext } from "../Editor";
import Button from "@/components/Button";
import { useReactFlow } from "@xyflow/react";
import { Slider } from "@/components/ui/slider";
import { AppNodeData } from "../../types/appNode";

export default function InspectorBar() {
  const { deleteElements, getNode } = useReactFlow();

  const context = useContext(EditorContext);
  if (!context) {
    throw new Error("EditorContext must be used within an EditorProvider");
  }

  const { focusNode, setFocusNode, focusEdge, setFocusEdge } = context;
  const [name, setName] = useState("");

  return (
    <div className="flex flex-1 flex-col h-full bg-editbar text-foreground border-l-1 border-editbar-border py-4 overflow-y-auto">
      <header className="text-center text-lg font-semibold border-b-2 border-editbar-border pb-4">
        Properties
      </header>

      {focusNode ? (
        <>
          {(() => {
            switch (focusNode.type) {
              case "ObjectNode":
                return (
                  <>
                    <div className="flex flex-col pt-5 gap-2 px-6">
                      <div className="flex items-center gap-1">
                        <PyramidIcon
                          className="stroke-editbar-border"
                          size={30}
                        />
                        <input
                          id="name"
                          className="border-2 border-editbar-border rounded-md p-1 bg-white text-sm w-full"
                          placeholder="Enter object name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="flex bg-slate-100 p-1 justify-center rounded-lg text-sm">
                        {focusNode?.data.object?.name}
                      </div>
                    </div>
                    <div className="flex flex-col pt-5 gap-2 px-6">
                      {focusNode.data.object?.vars.map((variable, index) => (
                        <Input
                          type="number"
                          key={index}
                          title={`${variable.name} [${variable.symbol}]`}
                          value={`${variable.value}`}
                          onChange={(e) => {
                            setFocusNode({
                              ...focusNode,
                              data: editObjectValueById(
                                variable.id,
                                e.target.value,
                                focusNode.data
                              ),
                            });
                          }}
                        />
                      ))}
                    </div>
                  </>
                );
              case "starter":
                return (
                  <div className="flex flex-col pt-5 gap-2 px-6">
                    {focusNode.data.output?.[0]?.param?.map((param, index) => (
                      <Input
                        type="number"
                        key={index}
                        title={`${param.name} [${param.symbol}]`}
                        value={`${param.value}`}
                        onChange={(e) => {
                          setFocusNode({
                            ...focusNode,
                            data: {
                              ...focusNode.data,
                              output: [
                                {
                                  handleId: "1",
                                  param:
                                    focusNode.data.output?.[0].param?.map(
                                      (p, i) => {
                                        if (i === index) {
                                          return {
                                            ...p,
                                            value: e.target.value,
                                          };
                                        }
                                        return p;
                                      }
                                    ) ?? [],
                                },
                              ],
                            },
                          });
                        }}
                      />
                    ))}
                  </div>
                );
              default:
                return (
                  <div className="flex flex-col items-center pt-4">
                    <p className="text-xs text-center text-gray-500">
                      No properties available for the selected object.
                    </p>
                  </div>
                );
            }
          })()}
          <div className="flex mt-4 mx-6 justify-center items-center">
            <Button
              variant="secondary"
              handleButtonClick={() => {
                deleteElements({
                  nodes: [{ id: focusNode.id }],
                });
                setFocusNode(undefined);
              }}
              className="flex w-full justify-center"
            >
              <div className="flex items-center gap-1">
                <TrashIcon size={14} />{" "}
                <p className="text-sm">Delete this node</p>
              </div>
            </Button>
          </div>
        </>
      ) : focusEdge ? (
        <>
          {(() => {
            switch (focusEdge.type) {
              case "default":
                return (
                  <>
                    {focusEdge.data.light && (
                      <div className="flex flex-col pt-5 gap-2 px-6">
                        <Input
                          type="number"
                          title={`Distance (mm)`}
                          value={`${focusEdge.data.light.distance ?? ""}`}
                          onChange={(e) => {
                            setFocusEdge({
                              ...focusEdge,
                              data: {
                                ...focusEdge.data,
                                light: {
                                  distance: e.target.value,
                                  focusDistance:
                                    focusEdge.data.light?.focusDistance ?? 0,
                                  locked: focusEdge.data.light?.locked ?? false,
                                },
                              },
                            });
                          }}
                        />
                        <p className="mt-4">light properties</p>
                        <div className="flex items-center gap-2">
                          <Slider
                            value={[focusEdge.data.light.focusDistance]}
                            max={+focusEdge.data.light.distance}
                            step={1}
                            onValueChange={(value) => {
                              setFocusEdge({
                                ...focusEdge,
                                data: {
                                  ...focusEdge.data,
                                  light: {
                                    distance:
                                      focusEdge.data.light?.distance ?? "25",
                                    focusDistance: value[0],
                                    locked:
                                      focusEdge.data.light?.locked ?? false,
                                  },
                                },
                              });
                            }}
                          />
                          <p className="text-sm flex-none">
                            {focusEdge.data.light.focusDistance} mm
                          </p>
                        </div>
                        {(
                          getNode(focusEdge.source)?.data as AppNodeData
                        ).data.output
                          ?.filter(
                            (t) => t.handleId === focusEdge.sourceHandle
                          )?.[0]
                          ?.param.map((param, index) => (
                            <Input
                              type="number"
                              key={index}
                              title={`${param.name} [${param.symbol}]`}
                              value={`${param.value}`}
                              disabled
                            />
                          ))}
                      </div>
                    )}
                  </>
                );
              default:
                return (
                  <div className="flex flex-col items-center pt-4">
                    <p className="text-xs text-center text-gray-500">
                      No properties available for the selected edge.
                    </p>
                  </div>
                );
            }
          })()}
        </>
      ) : (
        <div className="flex flex-col items-center py-4">
          <p className="text-xs text-center text-gray-500">
            Select an object to view its properties.
          </p>
        </div>
      )}
    </div>
  );
}
