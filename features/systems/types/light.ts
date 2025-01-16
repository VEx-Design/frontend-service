export interface EdgeData {
  light?: LightType;
}

interface LightType {
  distance: string;
  focusDistance: number;
  locked: boolean;
}
