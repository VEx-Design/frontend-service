export interface Table {
  size: { width: number; height: number }; // unit in mm (scene coordinates)
  margin: { width: number; height: number }; // unit in mm (scene coordinates)
  gridDistance: number; // unit in mm (scene coordinates)
  gridStyle: "dot" | "line"; // grid style
  gridColor: string; // grid color
  gridOpacity: number; // grid opacity
}
