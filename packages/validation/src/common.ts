import { z } from "zod";

// --- 基本バリデータ ---

/** UUID v4 バリデータ */
export const uuidSchema = z.string().uuid("有効なUUID形式で入力してください");

/** 空文字を許可しない文字列 */
export const nonEmptyString = (fieldName: string) =>
  z.string().min(1, `${fieldName}を入力してください`);

/** 空文字をundefinedに変換するオプション文字列 */
export const optionalString = z
  .string()
  .transform((val) => (val.trim() === "" ? undefined : val.trim()))
  .optional();

/** 最大文字数付き文字列 */
export const maxLengthString = (fieldName: string, max: number) =>
  z.string().max(max, `${fieldName}は${max}文字以内で入力してください`);

// --- 座標 ---

export const latitudeSchema = z
  .number()
  .min(-90, "緯度は-90以上で入力してください")
  .max(90, "緯度は90以下で入力してください");

export const longitudeSchema = z
  .number()
  .min(-180, "経度は-180以上で入力してください")
  .max(180, "経度は180以下で入力してください");

export const coordinatesSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

// --- ページネーション ---

export const paginationSchema = z.object({
  page: z.number().int().min(1, "ページ番号は1以上で入力してください").default(1),
  limit: z
    .number()
    .int()
    .min(1, "取得件数は1以上で入力してください")
    .max(100, "取得件数は100以下で入力してください")
    .default(20),
});

// --- URL ---

export const urlSchema = z
  .string()
  .url("有効なURLを入力してください")
  .optional()
  .or(z.literal(""));

// --- 言語コード ---

export const languageSchema = z
  .string()
  .min(2, "言語コードは2文字以上で入力してください")
  .max(5, "言語コードは5文字以内で入力してください")
  .default("ja");
