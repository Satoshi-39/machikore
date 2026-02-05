/**
 * シードデータ自動投入スクリプト
 *
 * サクラユーザー・マップ・スポットを自動生成する
 * Google Places API を使って実在するスポットデータを取得
 *
 * Usage:
 *   npx tsx scripts/seed/seed-all.ts              # 全ペルソナ投入
 *   npx tsx scripts/seed/seed-all.ts --dry-run     # API確認のみ（DB書き込みなし）
 *   npx tsx scripts/seed/seed-all.ts --batch 1     # バッチ1のみ
 *   npx tsx scripts/seed/seed-all.ts --user miki_cafe  # 特定ユーザーのみ
 */

import "dotenv/config";
import { personas } from "./config/personas";
import { createAdminClient } from "./lib/supabase-admin";
import { createUser } from "./creators/create-users";
import { createMap } from "./creators/create-maps";
import { createSpot } from "./creators/create-spots";
import { setSpotArticle, setMapArticleIntro } from "./creators/create-articles";

interface Options {
  dryRun: boolean;
  batch: number | null;
  username: string | null;
}

function parseArgs(): Options {
  const args = process.argv.slice(2);
  const options: Options = {
    dryRun: false,
    batch: null,
    username: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--batch":
        options.batch = parseInt(args[++i], 10);
        break;
      case "--user":
        options.username = args[++i];
        break;
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();

  console.log("🌱 シードデータ投入を開始します");
  if (options.dryRun) {
    console.log("📋 ドライランモード（DB書き込みなし）");
  }
  if (options.batch !== null) {
    console.log(`📦 バッチ ${options.batch} のみ投入`);
  }
  if (options.username) {
    console.log(`👤 ユーザー ${options.username} のみ投入`);
  }
  console.log("");

  const supabase = createAdminClient();

  // フィルタリング
  let targetPersonas = personas;
  if (options.batch !== null) {
    targetPersonas = targetPersonas.filter((p) => p.batch === options.batch);
  }
  if (options.username) {
    targetPersonas = targetPersonas.filter(
      (p) => p.user.username === options.username
    );
  }

  if (targetPersonas.length === 0) {
    console.log("⚠️ 対象のペルソナが見つかりません");
    process.exit(1);
  }

  const totalSpots = targetPersonas.reduce(
    (acc, p) => acc + p.maps.reduce((a, m) => a + m.spots.length, 0),
    0
  );
  console.log(
    `📊 対象: ${targetPersonas.length}ペルソナ / ${targetPersonas.reduce((a, p) => a + p.maps.length, 0)}マップ / ${totalSpots}スポット`
  );
  console.log("");

  let createdUsers = 0;
  let createdMaps = 0;
  let createdSpots = 0;
  let failedSpots = 0;

  for (const persona of targetPersonas) {
    console.log(
      `👤 ペルソナ: ${persona.user.display_name} (@${persona.user.username})`
    );

    // Step 1: ユーザー作成
    const { userId, created: userCreated } = await createUser(
      supabase,
      persona.user,
      options.dryRun
    );
    if (userCreated) createdUsers++;

    // Step 2-4: マップ → スポット → 記事
    for (const mapDef of persona.maps) {
      console.log(`  🗺️  マップ: ${mapDef.name}`);

      const { mapId, created: mapCreated } = await createMap(
        supabase,
        userId,
        mapDef,
        options.dryRun
      );
      if (mapCreated) createdMaps++;

      // マップの紹介文を設定
      if (mapDef.description && mapId !== "dry-run-map-id") {
        await setMapArticleIntro(
          supabase,
          mapId,
          mapDef.description,
          options.dryRun
        );
      }

      // スポット作成
      for (let i = 0; i < mapDef.spots.length; i++) {
        const spotQuery = mapDef.spots[i];

        try {
          const { userSpotId, created: spotCreated, placeResult } =
            await createSpot(
              supabase,
              userId,
              mapId,
              spotQuery,
              i,
              options.dryRun
            );

          if (spotCreated) createdSpots++;

          // 記事コンテンツを設定
          if (userSpotId && spotQuery.article) {
            await setSpotArticle(
              supabase,
              userSpotId,
              spotQuery.article,
              options.dryRun
            );
          }

          // API レート制限対策（100ms待機）
          await sleep(100);
        } catch (error) {
          failedSpots++;
          console.error(
            `      ❌ スポット作成エラー: "${spotQuery.query}"`,
            error instanceof Error ? error.message : error
          );
        }
      }
    }

    console.log("");
  }

  // サマリー
  console.log("═".repeat(50));
  console.log("📊 投入結果サマリー");
  console.log(`  ユーザー作成: ${createdUsers}`);
  console.log(`  マップ作成:   ${createdMaps}`);
  console.log(`  スポット作成: ${createdSpots}`);
  if (failedSpots > 0) {
    console.log(`  失敗:         ${failedSpots}`);
  }
  console.log("═".repeat(50));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch((error) => {
  console.error("❌ 致命的エラー:", error);
  process.exit(1);
});
