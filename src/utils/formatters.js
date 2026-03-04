// Formatting helpers for nullable numeric/boolean values from the API.
export function formatStatValue(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";
  return value.toLocaleString();
}

export function formatMaybeNumber(value, suffix = "") {
  if (typeof value !== "number" || !Number.isFinite(value)) return "N/A";
  return `${value.toLocaleString()}${suffix}`;
}

export function formatBoolean(value) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "Unknown";
}
