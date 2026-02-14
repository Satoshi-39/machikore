import { z } from "zod";
import { INPUT_LIMITS } from "@machikore/constants";
import { uuidSchema, optionalString } from "../common";

/** ユーザープロフィール更新フォームスキーマ */
export const userUpdateFormSchema = z.object({
  display_name: z
    .string()
    .min(1, "表示名を入力してください")
    .max(INPUT_LIMITS.USER_DISPLAY_NAME, `表示名は${INPUT_LIMITS.USER_DISPLAY_NAME}文字以内で入力してください`),
  username: z
    .string()
    .min(1, "ユーザー名を入力してください")
    .max(INPUT_LIMITS.USERNAME, `ユーザー名は${INPUT_LIMITS.USERNAME}文字以内で入力してください`)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "ユーザー名は半角英数字とアンダースコアのみ使用できます",
    ),
  bio: z
    .string()
    .max(INPUT_LIMITS.USER_BIO, `自己紹介は${INPUT_LIMITS.USER_BIO}文字以内で入力してください`)
    .optional()
    .or(z.literal("")),
  avatar_url: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  avatar_crop: z.record(z.unknown()).optional(),
  prefecture: optionalString,
  country: optionalString,
  age_group: optionalString,
  gender: optionalString,
});
export type UserUpdateFormValues = z.infer<typeof userUpdateFormSchema>;

/** ユーザー停止フォームスキーマ（管理者用） */
export const userSuspendFormSchema = z.object({
  id: uuidSchema,
  suspended_reason: z
    .string()
    .min(1, "停止理由を入力してください")
    .max(500, "停止理由は500文字以内で入力してください"),
});
export type UserSuspendFormValues = z.infer<typeof userSuspendFormSchema>;
