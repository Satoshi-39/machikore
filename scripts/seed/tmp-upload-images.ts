/**
 * シードデータの画像を一括アップロードする一時スクリプト
 *
 * フォルダ構成:
 *   scripts/seed/images/
 *   ├── maps/
 *   │   └── {マップ名}.jpg|.png      ← マップサムネイル
 *   └── spots/
 *       └── {マップ名}/
 *           └── {スポットクエリ名}/
 *               ├── 1.jpg|.png        ← order_index: 0（サムネ）
 *               ├── 2.jpg|.png        ← order_index: 1
 *               └── 3.jpg|.png        ← order_index: 2
 *
 * 使い方: npx tsx scripts/seed/tmp-upload-images.ts
 *         npx tsx scripts/seed/tmp-upload-images.ts --dry-run
 */

import "dotenv/config";
import { createAdminClient } from "./lib/supabase-admin";
import { personas } from "./config/personas";
import sharp from "sharp";
import * as fs from "fs";
import * as path from "path";

const IMAGES_DIR = path.join(__dirname, "images");

const RESIZE_CONFIG = {
  maps: { maxDimension: 800, quality: 75 },
  spots: { maxDimension: 1200, quality: 80 },
} as const;

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  const supabase = createAdminClient();

  if (dryRun) console.log("🔍 ドライランモード\n");

  let mapCount = 0;
  let spotImageCount = 0;

  for (const persona of personas) {
    const { username, email } = persona.user;

    // ユーザー取得
    const { data: users } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (!users?.length) {
      console.log(`⏭️  ${username}: ユーザー未作成（スキップ）`);
      continue;
    }

    const userId = users[0].id;
    console.log(`\n👤 ${username} (${userId})`);

    for (const mapDef of persona.maps) {
      // マップをDBから取得
      const { data: maps } = await supabase
        .from("maps")
        .select("id, thumbnail_url")
        .eq("user_id", userId)
        .eq("name", mapDef.name)
        .limit(1);

      if (!maps?.length) {
        console.log(`  ⏭️  マップ「${mapDef.name}」未作成（スキップ）`);
        continue;
      }

      const mapId = maps[0].id;

      // ── マップサムネイル ──
      const mapImagePath = findImageFile(
        path.join(IMAGES_DIR, "maps"),
        mapDef.name
      );

      if (mapImagePath) {
        if (maps[0].thumbnail_url) {
          console.log(`  ⏭️  マップサムネ「${mapDef.name}」設定済み（スキップ）`);
        } else if (dryRun) {
          console.log(
            `  🔍 [DRY RUN] マップサムネ: ${path.basename(mapImagePath)}`
          );
        } else {
          const url = await uploadMapThumbnail(
            supabase,
            userId,
            mapId,
            mapImagePath
          );
          if (url) {
            console.log(`  🗺️  マップサムネ設定: ${mapDef.name}`);
            mapCount++;
          }
        }
      }

      // ── スポット画像 ──
      // user_spots を order_index 順で取得
      const { data: userSpots } = await supabase
        .from("user_spots")
        .select("id, name, order_index, images_count")
        .eq("map_id", mapId)
        .order("order_index", { ascending: true });

      if (!userSpots?.length) continue;

      for (let i = 0; i < mapDef.spots.length; i++) {
        const spotQuery = mapDef.spots[i];
        const userSpot = userSpots[i];
        if (!userSpot) continue;

        // スポット画像フォルダを探す
        const spotDir = path.join(
          IMAGES_DIR,
          "spots",
          mapDef.name,
          spotQuery.query
        );

        if (!fs.existsSync(spotDir)) continue;

        // 画像ファイルを番号順で取得
        const imageFiles = fs
          .readdirSync(spotDir)
          .filter((f) => /^\d+\.(jpg|jpeg|png|webp)$/i.test(f))
          .sort(
            (a, b) =>
              parseInt(a.split(".")[0]) - parseInt(b.split(".")[0])
          );

        if (!imageFiles.length) continue;

        // 既存画像数を確認
        const existingCount = userSpot.images_count ?? 0;
        if (existingCount > 0) {
          console.log(
            `    ⏭️  「${userSpot.name}」画像${existingCount}枚設定済み（スキップ）`
          );
          continue;
        }

        if (dryRun) {
          console.log(
            `    🔍 [DRY RUN] 「${userSpot.name}」← ${imageFiles.length}枚`
          );
          continue;
        }

        let thumbnailImageId: string | null = null;

        for (let j = 0; j < imageFiles.length; j++) {
          const filePath = path.join(spotDir, imageFiles[j]);
          const imageId = await uploadSpotImage(
            supabase,
            userSpot.id,
            filePath,
            j
          );
          if (imageId) {
            spotImageCount++;
            // 1枚目（order_index: 0）をサムネイルに設定
            if (j === 0) thumbnailImageId = imageId;
          }
        }

        // images_count + thumbnail_image_id を更新
        const updateData: Record<string, unknown> = {
          images_count: imageFiles.length,
        };
        if (thumbnailImageId) {
          updateData.thumbnail_image_id = thumbnailImageId;
        }
        await supabase
          .from("user_spots")
          .update(updateData)
          .eq("id", userSpot.id);

        console.log(
          `    📸 「${userSpot.name}」← ${imageFiles.length}枚アップロード（サムネ設定済み）`
        );
      }
    }
  }

  console.log(
    `\n🎉 完了！ マップサムネ: ${mapCount}枚, スポット画像: ${spotImageCount}枚`
  );
}

/**
 * ディレクトリ内から名前に一致する画像ファイルを探す
 */
function findImageFile(dir: string, baseName: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const exts = [".jpg", ".jpeg", ".png", ".webp"];
  for (const ext of exts) {
    const filePath = path.join(dir, baseName + ext);
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

/**
 * マップサムネイルをリサイズ → アップロード → DB更新
 */
async function uploadMapThumbnail(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  mapId: string,
  localPath: string
): Promise<string | null> {
  try {
    const { maxDimension, quality } = RESIZE_CONFIG.maps;
    const buffer = await sharp(localPath)
      .resize(maxDimension, maxDimension, { fit: "inside" })
      .jpeg({ quality })
      .toBuffer();

    const storagePath = `${userId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("map-thumbnails")
      .upload(storagePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.warn(`    ⚠️ マップサムネアップロード失敗: ${uploadError.message}`);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("map-thumbnails").getPublicUrl(storagePath);

    // DB更新
    await supabase
      .from("maps")
      .update({ thumbnail_url: publicUrl })
      .eq("id", mapId);

    return publicUrl;
  } catch (err) {
    console.warn(
      `    ⚠️ マップサムネ処理エラー: ${err instanceof Error ? err.message : err}`
    );
    return null;
  }
}

/**
 * スポット画像をリサイズ → アップロード → images テーブルに挿入
 */
async function uploadSpotImage(
  supabase: ReturnType<typeof createAdminClient>,
  userSpotId: string,
  localPath: string,
  orderIndex: number
): Promise<string | null> {
  try {
    const { maxDimension, quality } = RESIZE_CONFIG.spots;
    const resized = sharp(localPath)
      .resize(maxDimension, maxDimension, { fit: "inside" })
      .jpeg({ quality });

    const metadata = await resized.metadata();
    const buffer = await resized.toBuffer();

    const storagePath = `${userSpotId}/${Date.now()}_${orderIndex}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("spot-images")
      .upload(storagePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      console.warn(`    ⚠️ スポット画像アップロード失敗: ${uploadError.message}`);
      return null;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("spot-images").getPublicUrl(storagePath);

    // images テーブルに挿入（idを返す）
    const { data: imageData, error: insertError } = await supabase
      .from("images")
      .insert({
        user_spot_id: userSpotId,
        cloud_path: publicUrl,
        width: metadata.width ?? null,
        height: metadata.height ?? null,
        file_size: buffer.length,
        order_index: orderIndex,
      })
      .select("id")
      .single();

    if (insertError) {
      console.warn(`    ⚠️ images挿入失敗: ${insertError.message}`);
      return null;
    }

    return imageData.id;
  } catch (err) {
    console.warn(
      `    ⚠️ スポット画像処理エラー: ${err instanceof Error ? err.message : err}`
    );
    return null;
  }
}

main().catch(console.error);
