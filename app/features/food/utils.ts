export function getNutrientColour(nutrientName: string) {
  const colours: Record<string, string> = {
    Calories: "#F97316",
    Protein: "#3B82F6",
    "Total fat": "#EAB308",
    "Total carbohydrates": "#A855F7",
    "Total sugars": "#EC4899",
    "Saturated fat": "#EF4444",
    "Monounsaturated fat": "#10B981",
    "Polyunsaturated fat": "#14B8A6",
    "Unsaturated fat": "#22C55E",
    "Trans fat": "#E11D48",
    Fibre: "#84CC16",
    "Added sugar": "#D946EF",
    Iron: "#B91C1C",
    Calcium: "#0EA5E9",
    Sodium: "#06B6D4",
    Magnesium: "#6366F1",
    Potassium: "#8B5CF6",
    "Vitamin A": "#F59E0B",
    "Vitamin C": "#16A34A",
    "Vitamin D": "#CA8A04",
    "Vitamin B12": "#2563EB",
  };

  return colours[nutrientName] ?? "#737373";
}
