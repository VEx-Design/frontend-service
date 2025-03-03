import { Light } from "../ClassLight/types/Light";
import { EdgeData } from "./types/AppEdge";

export default function setLightEdge(
  edge: EdgeData,
  lights: Light[]
): EdgeData {
  return {
    ...edge,
    lights,
  };
}
