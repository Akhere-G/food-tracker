export type EnergyUnit = "kcal" | "kj";
export type WeightUnit = "kg" | "lb";

export function energyValue(kilocalories: number, unit: EnergyUnit) {
  return unit === "kj" ? Math.round(kilocalories * 4.184) : Math.round(kilocalories);
}

export function weightValue(kilograms: number, unit: WeightUnit) {
  return unit === "lb"
    ? Number((kilograms * 2.20462).toFixed(1))
    : Number(kilograms.toFixed(1));
}
