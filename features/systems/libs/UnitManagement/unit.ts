export type Unit =
  | {
      tag: "compound" | "simple";
      id: string;
      name: string;
      symbol: string;
      havePrefix: boolean;
    }
  | {
      tag: "compound" | "simple";
      id: string;
      isCompound: true;
      unit: Unit;
      perUnit: Unit;
    };

export type UnitPrefix = {
  id: string;
  name: string;
  symbol: string;
  value: number;
};

export const units: Unit[] = [
  {
    tag: "simple",
    id: "METER",
    name: "Meter",
    symbol: "m",
    havePrefix: true,
  },
  {
    tag: "simple",
    id: "RADIAN",
    name: "Radian",
    symbol: "rad",
    havePrefix: true,
  },
  {
    tag: "simple",
    id: "DEGREE",
    name: "Degree",
    symbol: "°",
    havePrefix: false,
  },
  {
    tag: "simple",
    id: "VOLT",
    name: "Volt",
    symbol: "V",
    havePrefix: true,
  },
];

export const getUnitById = (id: string): Unit | undefined => {
  return units.find((unit) => unit.id === id);
};

export const getPrefixById = (id: string): UnitPrefix | undefined => {
  return unitPrefixes.find((prefix) => prefix.id === id);
};

units.push({
  tag: "compound",
  id: "VOLT_PER_METER",
  isCompound: true,
  unit: getUnitById("VOLT")!,
  perUnit: getUnitById("METER")!,
});

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
