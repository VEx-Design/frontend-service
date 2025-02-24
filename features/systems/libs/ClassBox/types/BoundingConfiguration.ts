export class BoundingConfiguration {
  height: number = 0;
  width: number = 0;
  fulcrum: number[] = new Array(2);
  interfacePosition: Map<string, [number, number]> = new Map();

  constructor(
    height: number,
    width: number,
    fulcrum: number[],
    interfacePosition: Map<string, [number, number]>
  ) {
    this.height = height;
    this.width = width;
    this.fulcrum = fulcrum;
    this.interfacePosition = interfacePosition;
  }

  updateConfig(
    height: number,
    width: number,
    fulcrum: number[],
    interfacePosition: Map<string, [number, number]>
  ) {
    this.height = height;
    this.width = width;
    this.fulcrum = fulcrum;
    this.interfacePosition = interfacePosition;
  }
}
