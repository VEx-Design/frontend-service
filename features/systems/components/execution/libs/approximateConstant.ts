export default function approximateConstant(
  value: number,
  tolerance: number = 1e-4
): string | number {
  const constants: { [key: string]: number } = {
    0: 0,
    π: Math.PI,
    e: Math.E,
    "√2": Math.SQRT2,
    "√3": Math.sqrt(3),
    "√5": Math.sqrt(5),
    "1/√2": 1 / Math.SQRT2,
    "1/√3": 1 / Math.sqrt(3),
    "√2/2": Math.SQRT2 / 2,
    "√2/4": Math.SQRT2 / 4,
    "√3/2": Math.sqrt(3) / 2,
    "√5/2": Math.sqrt(5) / 2,
    "1/π": 1 / Math.PI,
    "2π": 2 * Math.PI,
    "1/e": 1 / Math.E,
    "ln(2)": Math.LN2,
    "ln(10)": Math.LN10,
  };

  for (const [name, constantValue] of Object.entries(constants)) {
    if (Math.abs(value - constantValue) < tolerance) {
      return name;
    }
    if (Math.abs(value + constantValue) < tolerance) {
      return "-" + name;
    }
  }

  return value;
}
