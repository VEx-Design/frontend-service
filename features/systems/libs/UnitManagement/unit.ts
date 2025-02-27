export type Unit = {
  id: string;
  name: string;
  symbol: string;
  havePrefix: boolean;
};

export type UnitPrefix = {
  id: string;
  name: string;
  symbol: string;
  value: number;
};

export const units: Unit[] = [
  {
    id: "METER",
    name: "Meter",
    symbol: "m",
    havePrefix: true,
  },
  {
    id: "RADIAN",
    name: "Radius",
    symbol: "rad",
    havePrefix: true,
  },
  {
    id: "DEGREE",
    name: "Degree",
    symbol: "°",
    havePrefix: false,
  },
];

export const unitPrefixes: UnitPrefix[] = [
  {
    id: "MILLI",
    name: "Milli",
    symbol: "m",
    value: 1e-3,
  },
  {
    id: "CENTI",
    name: "Centi",
    symbol: "c",
    value: 1e-2,
  },
];

export const getUnitById = (id: string): Unit | undefined => {
  return units.find((unit) => unit.id === id);
};

export const getPefixById = (id: string): UnitPrefix | undefined => {
  return unitPrefixes.find((prefix) => prefix.id === id);
};
