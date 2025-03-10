import { VariableFreeS } from "../../ClassConfig/types/FreeSpace";
import { Light } from "../../ClassLight/types/Light";

export default function createFreeScope(
  variables: VariableFreeS[],
  inputLight: Light,
  distance: number
): number[] {
  const scope: number[] = [];
  variables.map((variable) => {
    if (variable.type === "distance") {
      scope.push(distance);
    } else if (variable.type === "parameter") {
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
