import { Config } from "../../ClassConfig/types/Config";
import getLightParam from "../../ClassLight/getLightParam";
import { Light } from "../../ClassLight/types/Light";

export default function isThereLight(light: Light, config: Config): boolean {
  const threshold = 1e-6; // Adjust as needed

  return config.parameterGroups.every((group) =>
    group.parameterIds.some((paramId) => {
      const param = getLightParam(light, paramId);
      return param !== undefined && Math.abs(param.value) > threshold;
    })
  );
}
