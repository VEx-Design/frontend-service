export class BoundingConfiguration {
  name: string = "";
  height: number = 0;
  width: number = 0;
  referencePosition: [number,number] = [0.5,0.5];
  interfacePositions: Map<string, [number, number]> = new Map();

  constructor(
    name: string,
    height: number,
    width: number,
    referencePoint:[number,number],
    interfacePositions: Map<string, [number, number]>
  ) {
    this.name = name;
    this.height = height;
    this.width = width;
    this.referencePosition = referencePoint;
    this.interfacePositions = interfacePositions;
  }

}
