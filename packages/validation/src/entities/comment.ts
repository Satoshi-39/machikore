import { z } from "zod";
import { INPUT_LIMITS } from "@machikore/constants";
import { uuidSchema } from "../common";

/** コメント作成フォームスキーマ */
export const commentCreateFormSchema = z.object({
  content: z
    .string()
    .min(1, "コメントを入力してください")
    .max(INPUT_LIMITS.COMMENT, `コメントは${INPUT_LIMITS.COMMENT}文字以内で入力してください`),
  map_id: uuidSchema.optional(),
  user_spot_id: uuidSchema.optional(),
  parent_id: uuidSchema.optional(),
  reply_to_user_id: uuidSchema.optional(),
});
export type CommentCreateFormValues = z.infer<typeof commentCreateFormSchema>;
