import { Parameter } from "../ClassParameter/types/Parameter";
import { Config } from "./types/Config";

export default function getParameter(
  config: Config,
  id: string
): Parameter | undefined {
  return config.parameters.find((param) => param.id === id);
}
