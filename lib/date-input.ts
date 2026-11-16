import { format, isValid, parse } from "date-fns";

const REFERENCE_DATE = new Date(2000, 0, 1);

export function isValidDateInput(value: unknown): value is string {
  return isValidFormattedInput(value, "yyyy-MM-dd");
}

export function isValidTimeInput(value: unknown): value is string {
  return isValidFormattedInput(value, "HH:mm");
}

function isValidFormattedInput(
  value: unknown,
  inputFormat: string,
): value is string {
  if (typeof value !== "string" || value.length === 0) return false;

  const parsed = parse(value, inputFormat, REFERENCE_DATE);
  return isValid(parsed) && format(parsed, inputFormat) === value;
}
