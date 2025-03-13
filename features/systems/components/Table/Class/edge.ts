export interface Edge {
  id: string;
  source: string;
  sourceInterface: string;
  target: string;
  targetInterface: string;
  expectedDistance: number;
  actualDistance: number;
}
