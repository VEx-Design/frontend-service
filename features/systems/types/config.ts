import { Position } from "@xyflow/react";

export type Config = {
  types: Type[];
  parameters: Parameter[];
};

export type Type = {
  id: string;
  name: string;
  description?: string;
  picture: string;
  variables: {
    id: string;
    name: string;
    symbol: string;
  }[];
  interface: Interface[];
};

export type Interface = {
  id: string;
  name: string;
  description?: string;
  location: Position;
};

export type Parameter = {
  id: string;
  name: string;
  symbol: string;
  description?: string;
};
