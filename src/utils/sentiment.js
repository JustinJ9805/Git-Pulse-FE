// Visual/text mapping for sentiment scores.
export function sentimentColor(score) {
  if (score >= 70) return "bg-emerald-400";
  if (score >= 45) return "bg-amber-400";
  return "bg-rose-400";
}

export function sentimentLabel(score) {
  if (score >= 70) return "Constructive";
  if (score >= 45) return "Mixed";
  return "Tense";
}
