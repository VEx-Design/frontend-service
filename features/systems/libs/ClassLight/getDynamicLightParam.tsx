import { evaluate } from "mathjs";
import { Config } from "../ClassConfig/types/Config";
import createFreeScope from "../ClassFlow/calculation/createFreeScope";
import { Light, LightParam } from "./types/Light";

export default function getDynamicLightParam(
  config: Config,
  light: Light,
  paramId: string,
  focusDistance: number
): LightParam | undefined {
  const formulaParamFree = config.freeSpaces[0].formulas.find(
    (f) => f.paramId === paramId
  );
  if (formulaParamFree !== undefined) {
    const freeScope = {
      x: createFreeScope(
        formulaParamFree.variables,
        light,
        +(focusDistance || 0)
      ),
    };
    const freeValue = evaluate(formulaParamFree.completeStream, freeScope);
    return {
      paramId: paramId,
      value: freeValue,
      unitPrefixId: "MILLI",
    };
  } else {
    return {
      paramId: paramId,
      value:
        light.params.find((paramValue) => paramValue.paramId === paramId)
          ?.value || 0,
      unitPrefixId: "MILLI",
    };
  }
}
