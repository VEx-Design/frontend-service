import { Config, ParameterGroup } from "./types/Config";

export default function addParameterGroup(
  config: Config,
  parameterGroup: ParameterGroup
) {
  return {
    ...config,
    parameterGroups: [...config.parameterGroups, parameterGroup],
  };
}
