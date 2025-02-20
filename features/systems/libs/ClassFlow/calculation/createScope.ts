import { Variable } from "../../ClassInterface/types/Formula";
import { Object } from "../../ClassObject/types/Object";

export default function createScope(
  variables: Variable[],
  object: Object
): number[] {
  const scope: number[] = [];
  variables.map((variable) => {
    if (variable.type === "prop") {
      const prop = object.vars.find((prop) => prop.propId === variable.propId);
      if (prop) {
        scope.push(prop.value);
      }
    } else if (variable.type === "interface") {
      const interfaceObj = object.interfaces.find(
        (interfaceObj) => interfaceObj.interfaceId === variable.interfaceId
      );
      if (interfaceObj) {
        const input = interfaceObj.input.find(
          (input) => input.paramId === variable.paramId
        );
        if (input) {
          scope.push(input.value);
        }
      }
    }
  });
  return scope;
}
