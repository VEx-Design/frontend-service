export class BoundingConfiguration {
  height: number = 0;
  width: number = 0;
  referencePosition: [number,number] = [0,0];
  interfacePositions: Map<string, [number, number]> = new Map();

  constructor(
    height: number,
    width: number,
    referencePoint:[number,number],
    interfacePositions: Map<string, [number, number]>
  ) {
    this.height = height;
    this.width = width;
    this.referencePosition = referencePoint;
    this.interfacePositions = interfacePositions;
  }

  updateConfig(
    height: number,
    width: number,
    referencePoint: [number,number],
    interfacePositions: Map<string, [number, number]>
  ) {
    this.height = height;
    this.width = width;
    this.referencePosition = referencePoint
    this.interfacePositions = interfacePositions;
  }
}
