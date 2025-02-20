import { forEach } from "lodash";
import { Config } from "../../ClassConfig/types/Config";
import { AppEdge } from "../../ClassEdge/types/AppEdge";
import { AppNode } from "../../ClassNode/types/AppNode";
import setEdgeInput from "../setEdgeInput";
import setNodeInput from "../setNodeInput";
import { Flow } from "../types/Flow";
import createScope from "./createScope";
import { evaluate } from "mathjs";
import setNodeOutput from "../setNodeOuput";
import { ObjectOutput } from "../../ClassObject/types/Object";

export default function calculate(flow: Flow, config: Config): Flow {
  const { types, parameters } = config;
  let resultFlow = flow;
  const stater: AppNode[] = resultFlow.nodes.filter(
    (node) => node.type === "starter"
  );
  const processQueue: AppEdge[] = resultFlow.edges.filter((edge) =>
    stater.some((node) => node.id === edge.source)
  );

  let input: { paramId: string; value: number }[] = [];
  while (processQueue.length > 0) {
    const edge = processQueue.shift();
    if (!edge) continue;

    const { source } = edge;
    const sourceNode = resultFlow.nodes.find((node) => node.id === source);
    if (sourceNode?.type === "starter") {
      input = parameters.map((param) => ({
        paramId: param.id,
        value:
          sourceNode.data.data.initials?.find(
            (initial) => initial.paramId === param.id
          )?.value || 0,
      }));
      resultFlow = setEdgeInput(resultFlow, edge.id, input);
      console.log(resultFlow);
    } else if (sourceNode?.type === "ObjectNode") {
      console.log("Object");
      const sourceInterfaceId =
        edge.sourceHandle?.replace("source-handle-", "") || "";
      console.log(sourceInterfaceId);
      input = parameters.map((param) => ({
        paramId: param.id,
        value:
          sourceNode.data.data.object?.interfaces
            .find((interfaceObj) => {
              return interfaceObj.interfaceId === sourceInterfaceId;
            })
            ?.output.find((output) => output.paramId === param.id)?.value || 0,
      }));
      resultFlow = setEdgeInput(resultFlow, edge.id, input);
    }
    const targetInterfaceId =
      edge.targetHandle?.replace("target-handle-", "") || "";
    resultFlow = setNodeInput(
      resultFlow,
      edge.target,
      targetInterfaceId,
      input
    );
    const targetNode = resultFlow.nodes.find((node) => node.id === edge.target);
    if (targetNode && targetNode.data.data.object) {
      const targetType = types.find(
        (type) => type.id === targetNode?.data.data.object?.typeId
      );
      forEach(targetType?.interfaces, (interfaceObj) => {
        forEach(interfaceObj.formulaConditions, (condition) => {
          const ouput: ObjectOutput[] = [];
          forEach(condition.formulas, (formula) => {
            if (targetNode?.data.data.object) {
              const scope = {
                x: createScope(formula.variables, targetNode.data.data.object),
              };
              console.log(formula.completeStream);
              console.log(scope);
              const answer = evaluate(formula.completeStream, scope);
              ouput.push({
                paramId: formula.paramId,
                value: answer,
              });
              resultFlow = setNodeOutput(
                resultFlow,
                edge.target,
                interfaceObj.id,
                ouput
              );
            }
          });
        });
      });
      const outgoingEdges = resultFlow.edges.filter(
        (e) => e.source === targetNode?.id
      );
      processQueue.push(...outgoingEdges);
    }
  }
  return resultFlow;
}
