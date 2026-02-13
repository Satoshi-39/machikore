import { z } from "zod";

/** モデレーションステータス */
export const moderationStatusSchema = z.enum(["normal", "hidden", "removed"], {
  errorMap: () => ({ message: "モデレーションステータスを選択してください" }),
});
export type ModerationStatus = z.infer<typeof moderationStatusSchema>;

/** 通報理由 */
export const reportReasonSchema = z.enum(
  ["spam", "inappropriate", "harassment", "misinformation", "copyright", "other"],
  { errorMap: () => ({ message: "通報理由を選択してください" }) },
);
export type ReportReason = z.infer<typeof reportReasonSchema>;

/** 通報ステータス */
export const reportStatusSchema = z.enum(
  ["pending", "reviewing", "resolved", "dismissed"],
  { errorMap: () => ({ message: "通報ステータスを選択してください" }) },
);
export type ReportStatus = z.infer<typeof reportStatusSchema>;

/** 通報対象タイプ */
export const reportTargetTypeSchema = z.enum(["map", "spot", "user", "comment"], {
  errorMap: () => ({ message: "通報対象タイプを選択してください" }),
});
export type ReportTargetType = z.infer<typeof reportTargetTypeSchema>;

/** 特集リンクタイプ */
export const featuredLinkTypeSchema = z.enum(["url", "magazine"], {
  errorMap: () => ({ message: "リンクタイプを選択してください" }),
});
export type FeaturedLinkType = z.infer<typeof featuredLinkTypeSchema>;

/** 特集ソースタイプ */
export const featuredSourceTypeSchema = z.enum(["tag", "manual"], {
  errorMap: () => ({ message: "ソースタイプを選択してください" }),
});
export type FeaturedSourceType = z.infer<typeof featuredSourceTypeSchema>;
