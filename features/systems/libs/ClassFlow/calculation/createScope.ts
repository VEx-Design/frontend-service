import { Variable } from "../../ClassInterface/types/Formula";
import { Light } from "../../ClassLight/types/Light";
import { OpticalObject } from "../../ClassObject/types/Object";

export default function createScope(
  variables: Variable[],
  object: OpticalObject,
  inputLight: Light
): number[] {
  const scope: number[] = [];
  variables.map((variable) => {
    if (variable.type === "prop") {
      const prop = object.vars.find((prop) => prop.propId === variable.propId);
      if (prop) {
        scope.push(prop.value);
      }
    } else if (variable.type === "interface") {
      const light = inputLight.params.find(
        (param) => param.paramId === variable.paramId
      );
      if (light) {
        scope.push(light.value);
      } else {
        scope.push(0);
      }
    }
  });
  return scope;
}
