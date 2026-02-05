# 実行方法

# ドライラン（DB書き込みなし、API確認のみ）

npx tsx scripts/seed/seed-all.ts --dry-run

# バッチ1のみ投入（25スポット、API費用 ~$0.80）

npx tsx scripts/seed/seed-all.ts --batch 1

# 全ペルソナ一括投入（94スポット、API費用 ~$3）

npx tsx scripts/seed/seed-all.ts

npx tsx scripts/seed/tmp-upload-images.ts
