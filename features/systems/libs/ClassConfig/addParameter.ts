import { Parameter } from "../ClassParameter/types/Parameter";
import { Config } from "./types/Config";

export default function addParameter(config: Config, parameter: Parameter) {
  return {
    ...config,
    parameters: [...config.parameters, parameter],
  };
}
