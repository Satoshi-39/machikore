import { z } from "zod";
import {
  nonEmptyString,
  optionalString,
  latitudeSchema,
  longitudeSchema,
} from "../common";

/** 街（machi）登録フォームスキーマ（管理者用） */
export const machiCreateFormSchema = z.object({
  id: nonEmptyString("ID"),
  name: nonEmptyString("街名").max(100, "街名は100文字以内で入力してください"),
  name_kana: optionalString,
  prefecture_id: nonEmptyString("都道府県ID"),
  prefecture_name: nonEmptyString("都道府県名"),
  city_id: optionalString,
  city_name: optionalString,
  latitude: latitudeSchema.optional(),
  longitude: longitudeSchema.optional(),
  place_type: optionalString,
  osm_id: z.number().int().optional(),
});
export type MachiCreateFormValues = z.infer<typeof machiCreateFormSchema>;
