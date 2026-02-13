import { z } from "zod";
import { INPUT_LIMITS } from "@machikore/constants";
import {
  uuidSchema,
  optionalString,
  latitudeSchema,
  longitudeSchema,
  languageSchema,
} from "../common";

/** スポット作成フォームスキーマ */
export const spotCreateFormSchema = z.object({
  map_id: uuidSchema,
  description: z
    .string()
    .min(1, "説明を入力してください")
    .max(INPUT_LIMITS.SPOT_ONE_WORD, `説明は${INPUT_LIMITS.SPOT_ONE_WORD}文字以内で入力してください`),
  name: z
    .string()
    .max(INPUT_LIMITS.SPOT_NAME, `スポット名は${INPUT_LIMITS.SPOT_NAME}文字以内で入力してください`)
    .optional()
    .or(z.literal("")),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  master_spot_id: uuidSchema.optional(),
  label_id: uuidSchema.optional(),
  spot_color: optionalString,
  order_index: z.number().int().min(0).optional(),
  language: languageSchema,
  machi_id: uuidSchema.optional(),
});
export type SpotCreateFormValues = z.infer<typeof spotCreateFormSchema>;

/** スポット更新フォームスキーマ */
export const spotUpdateFormSchema = spotCreateFormSchema
  .omit({ map_id: true })
  .partial()
  .extend({
    id: uuidSchema,
  });
export type SpotUpdateFormValues = z.infer<typeof spotUpdateFormSchema>;
