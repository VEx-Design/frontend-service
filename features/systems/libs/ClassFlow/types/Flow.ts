import { AppEdge } from "../../ClassEdge/types/AppEdge";
import { AppNode } from "../../ClassNode/types/AppNode";

export type Flow = {
  nodes: AppNode[];
  edges: AppEdge[];
};
