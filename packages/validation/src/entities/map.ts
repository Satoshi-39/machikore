import { z } from "zod";
import { INPUT_LIMITS } from "@machikore/constants";
import { uuidSchema, optionalString, languageSchema } from "../common";

/** マップ作成フォームスキーマ */
export const mapCreateFormSchema = z.object({
  name: z
    .string()
    .min(1, "マップ名を入力してください")
    .max(INPUT_LIMITS.MAP_NAME, `マップ名は${INPUT_LIMITS.MAP_NAME}文字以内で入力してください`),
  description: z
    .string()
    .max(INPUT_LIMITS.MAP_DESCRIPTION, `説明は${INPUT_LIMITS.MAP_DESCRIPTION}文字以内で入力してください`)
    .optional()
    .or(z.literal("")),
  category_id: uuidSchema.optional(),
  is_public: z.boolean().default(true),
  language: languageSchema,
  thumbnail_url: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  thumbnail_crop: z.record(z.unknown()).optional(),
});
export type MapCreateFormValues = z.infer<typeof mapCreateFormSchema>;

/** マップ更新フォームスキーマ */
export const mapUpdateFormSchema = mapCreateFormSchema.partial().extend({
  id: uuidSchema,
});
export type MapUpdateFormValues = z.infer<typeof mapUpdateFormSchema>;
