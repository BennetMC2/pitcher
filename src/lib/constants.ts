export const FREE_PITCH_LIMIT = 3;
export const FREE_MAX_RECORDING_SECONDS = 120; // 2 minutes
export const PAID_MAX_RECORDING_SECONDS = 300; // 5 minutes

export const CREDIT_PACKS = [
  { id: "pack_5",  credits: 5,  priceCents: 900,  priceLabel: "$9",  perPitch: "$1.80" },
  { id: "pack_15", credits: 15, priceCents: 1900, priceLabel: "$19", perPitch: "$1.27" },
  { id: "pack_50", credits: 50, priceCents: 4900, priceLabel: "$49", perPitch: "$0.98" },
] as const;

export const STRIPE_PRICE_IDS: Record<string, string> = {
  pack_5:  process.env.STRIPE_PRICE_PACK_5  ?? "",
  pack_15: process.env.STRIPE_PRICE_PACK_15 ?? "",
  pack_50: process.env.STRIPE_PRICE_PACK_50 ?? "",
};

export const STORAGE_BUCKET = "pitch-videos";

export const SESSION_STATUS = {
  UPLOADING: "uploading",
  PROCESSING: "processing",
  COMPLETE: "complete",
  FAILED: "failed",
} as const;

export const GRADE_THRESHOLDS = [
  { min: 93, grade: "A+" },
  { min: 90, grade: "A" },
  { min: 87, grade: "A-" },
  { min: 83, grade: "B+" },
  { min: 80, grade: "B" },
  { min: 77, grade: "B-" },
  { min: 73, grade: "C+" },
  { min: 70, grade: "C" },
  { min: 60, grade: "D" },
  { min: 0, grade: "F" },
] as const;

export function scoreToGrade(score: number): string {
  return GRADE_THRESHOLDS.find((t) => score >= t.min)?.grade ?? "F";
}
