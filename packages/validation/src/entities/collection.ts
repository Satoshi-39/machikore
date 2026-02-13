import { z } from "zod";
import { INPUT_LIMITS } from "@machikore/constants";
import { uuidSchema } from "../common";

/** コレクション作成フォームスキーマ */
export const collectionCreateFormSchema = z.object({
  name: z
    .string()
    .min(1, "コレクション名を入力してください")
    .max(INPUT_LIMITS.COLLECTION_NAME, `コレクション名は${INPUT_LIMITS.COLLECTION_NAME}文字以内で入力してください`),
  description: z
    .string()
    .max(INPUT_LIMITS.COLLECTION_DESCRIPTION, `説明は${INPUT_LIMITS.COLLECTION_DESCRIPTION}文字以内で入力してください`)
    .optional()
    .or(z.literal("")),
  is_public: z.boolean().default(true),
  thumbnail_url: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  thumbnail_crop: z.record(z.unknown()).optional(),
});
export type CollectionCreateFormValues = z.infer<typeof collectionCreateFormSchema>;

/** コレクション更新フォームスキーマ */
export const collectionUpdateFormSchema = collectionCreateFormSchema.partial().extend({
  id: uuidSchema,
});
export type CollectionUpdateFormValues = z.infer<typeof collectionUpdateFormSchema>;
