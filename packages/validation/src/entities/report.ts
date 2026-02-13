import { z } from "zod";
import { INPUT_LIMITS } from "@machikore/constants";
import { uuidSchema } from "../common";
import {
  reportReasonSchema,
  reportTargetTypeSchema,
  reportStatusSchema,
  moderationStatusSchema,
} from "../enums";

/** 通報作成フォームスキーマ */
export const reportCreateFormSchema = z.object({
  target_type: reportTargetTypeSchema,
  target_id: uuidSchema,
  reason: reportReasonSchema,
  description: z
    .string()
    .max(INPUT_LIMITS.REPORT_DESCRIPTION, `説明は${INPUT_LIMITS.REPORT_DESCRIPTION}文字以内で入力してください`)
    .optional()
    .or(z.literal("")),
});
export type ReportCreateFormValues = z.infer<typeof reportCreateFormSchema>;

/** 通報ステータス更新スキーマ（管理者用） */
export const reportUpdateStatusSchema = z.object({
  id: uuidSchema,
  status: reportStatusSchema,
  admin_notes: z.string().optional().or(z.literal("")),
});
export type ReportUpdateStatusValues = z.infer<typeof reportUpdateStatusSchema>;

/** コンテンツモデレーションスキーマ（管理者用） */
export const contentModerationSchema = z.object({
  target_type: z.enum(["map", "spot", "comment"], {
    errorMap: () => ({ message: "対象タイプを選択してください" }),
  }),
  target_id: uuidSchema,
  moderation_status: moderationStatusSchema,
});
export type ContentModerationValues = z.infer<typeof contentModerationSchema>;
