import { Interface } from "../../ClassInterface/types/Interface";

export type Type = {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  picture: string;
  properties: Property[];
  interfaces: Interface[];
};

export type Property = {
  id: string;
  name: string;
  symbol: string;
  description?: string;
};
