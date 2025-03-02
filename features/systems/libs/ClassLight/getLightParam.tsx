import { Light } from "./types/Light";

export default function getLightParam(light: Light, paramId: string) {
  return light.params.find((param) => param.paramId === paramId);
}
