export interface Object {
  id: string; // object id
  name: string; // object name
  size: { width: number; height: number }; // unit in mm (scene coordinates)
  position: { x: number; y: number }; // position in scene coordinates
  rotation: number; // rotation in degrees
  referencePosition: [number, number]; // unit in ratio
  interfacePositions: Map<string, [number, number]>; // Map<interface, position> unit in ratio
  isColliding?: boolean; // Flag to indicate if object is colliding
  isMirror?: boolean; // Flag to indicate if object is a mirror
}
