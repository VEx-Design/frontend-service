export interface Light {
  distance: string;
  focusDistance: number;
  locked: boolean;
  input: LightInput[];
}

export interface LightInput {
  paramId: string;
  value: number;
}
