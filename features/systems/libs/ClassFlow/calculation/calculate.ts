import { Config } from "../../ClassConfig/types/Config";
import { AppEdge } from "../../ClassEdge/types/AppEdge";
import { AppNode } from "../../ClassNode/types/AppNode";
import { Flow } from "../types/Flow";
import { Light } from "../../ClassLight/types/Light";
import setNodeInput from "../setNodeInput";
import setEdgeInput from "../setEdgeInput";
import createScope from "./createScope";
import { evaluate } from "mathjs";
import setNodeOutput from "../setNodeOuput";
import addInterface from "../addInterface";
import isThereLight from "./isThereLight";
import createFreeScope from "./createFreeScope";

export default function calculate(flow: Flow, config: Config): Flow {
  const { types, parameters } = config;
  let resultFlow = addInterface(flow, config);

  const stater: AppNode[] = resultFlow.nodes.filter(
    (node) => node.type === "starter"
  );
  const processQueue: AppEdge[] = resultFlow.edges.filter((edge) =>
    stater.some((node) => node.id === edge.source)
  );

  while (processQueue.length > 0) {
    const edge = processQueue.shift();
    if (!edge) continue;

    const { source, target } = edge;
    const sourceNode = resultFlow.nodes.find((node) => node.id === source);

    if (!sourceNode) continue;
    const sourceData = sourceNode.data.data;

    const inputs: Light[] = [];
    if (sourceNode?.type === "starter") {
      console.log("sourceData", sourceData);
      sourceData.initials?.forEach((light) => {
        const input: Light = {
          id: light.id,
          formInterfaceId: light.formInterfaceId,
          params: [],
          path: light.path,
        };
        parameters.forEach((param) => {
          const value = light.params.find(
            (paramValue) => paramValue.paramId === param.id
          )?.value;
          input.params.push({
            paramId: param.id,
            value: value || 0,
            unitPrefixId: "MILLI",
          });
        });
        if (isThereLight(input, config)) {
          inputs.push(input);
        }
      });
    } else if (sourceNode?.type === "ObjectNode") {
      const sourceInterfaceId =
        edge.sourceHandle?.replace("source-handle-", "") || "";
      sourceData.object?.interfaces
        .find((inter) => inter.interfaceId === sourceInterfaceId)
        ?.output.forEach((light) => {
          if (isThereLight(light, config)) {
            inputs.push(light);
          }
        });
    }

    resultFlow = setEdgeInput(resultFlow, edge.id, inputs);
    const targetInterfaceId =
      edge.targetHandle?.replace("target-handle-", "") || "";
    resultFlow = setNodeInput(resultFlow, source, targetInterfaceId, inputs);

    const targetNode = resultFlow.nodes.find((node) => node.id === edge.target);
    if (!targetNode) continue;

    const inputObjects: Light[] = [];
    inputs.forEach((input) => {
      const newInput: Light = { ...input, params: [] };
      parameters.forEach((param) => {
        const formulaParamFree = config.freeSpaces[0].formulas.find(
          (f) => f.paramId === param.id
        );
        if (formulaParamFree !== undefined) {
          const freeScope = {
            x: createFreeScope(
              formulaParamFree.variables,
              input,
              +(edge.data.data.distance || 0)
            ),
          };
          const freeValue = evaluate(
            formulaParamFree.completeStream,
            freeScope
          );
          newInput.params.push({
            paramId: param.id,
            value: freeValue,
            unitPrefixId: "MILLI",
          });
        } else {
          newInput.params.push({
            paramId: param.id,
            value:
              input.params.find((paramValue) => paramValue.paramId === param.id)
                ?.value || 0,
            unitPrefixId: "MILLI",
          });
        }
      });
      inputObjects.push(newInput);
    });

    resultFlow = setNodeInput(
      resultFlow,
      target,
      targetInterfaceId,
      inputObjects
    );

    const targetData = targetNode.data.data;
    if (targetNode.type === "starter") continue;

    const targetObject = targetData.object;
    if (!targetObject) continue;
    const targetType = types.find((type) => type.id === targetObject.typeId);
    const targetAction = targetType?.interfaces.find(
      (inter) => inter.id === targetInterfaceId
    )?.formulaConditions;
    if (!targetAction) continue;
    const effectInterface: string[] = [];
    targetAction.forEach((action) => {
      if (action.type === "TRIGGER AT") {
        if (action.interfaceId) {
          effectInterface.push(action.interfaceId);
        }
        const formula = action.formulas;
        const outputs: Light[] = [];
        inputObjects.forEach((light) => {
          const output: Light = {
            id: crypto.randomUUID(),
            formInterfaceId: targetInterfaceId,
            params: [],
            path: light.path,
          };
          parameters.map((param) => {
            const formulaParam = formula.find((f) => f.paramId === param.id);
            if (formulaParam !== undefined) {
              const scope = {
                x: createScope(
                  formulaParam.variables,
                  targetNode.data.data.object!,
                  light
                ),
              };
              const value = evaluate(formulaParam.completeStream, scope);
              output.params.push({
                paramId: param.id,
                value: value,
                unitPrefixId: "MILLI",
              });
            } else {
              output.params.push({
                paramId: param.id,
                value:
                  light.params.find(
                    (paramValue) => paramValue.paramId === param.id
                  )?.value || 0,
                unitPrefixId: "MILLI",
              });
            }
          });
          outputs.push(output);
        });
        resultFlow = setNodeOutput(
          resultFlow,
          targetNode.id,
          action.interfaceId || "",
          targetInterfaceId,
          outputs
        );
      }
    });
    effectInterface.forEach((interId) => {
      const nextEdges = resultFlow.edges.filter(
        (edge) =>
          edge.source === targetNode.id &&
          edge.sourceHandle === `source-handle-${interId}`
      );
      nextEdges.forEach((edge) => {
        processQueue.push(edge);
      });
    });
  }
  return resultFlow;
}
