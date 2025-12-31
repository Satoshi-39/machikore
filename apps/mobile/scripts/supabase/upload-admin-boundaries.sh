#!/bin/bash

# admin_boundariesをSupabaseにアップロード

DB_HOST="db.whgptckcuskqggyybruw.supabase.co"
DB_PASS="SxGbM.5QxR/7wpg"
DB_USER="postgres"
DB_NAME="postgres"
DB_PORT="5432"

echo "=== admin_boundaries アップロード開始 ==="
echo ""

total=0
success=0

for f in scripts/data/admin_boundaries/jp_*/jp_*_admin_boundaries.sql; do
  pref=$(basename $(dirname "$f"))
  count=$(PGPASSWORD="$DB_PASS" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$f" 2>&1 | grep -c "INSERT 0 1")
  echo "[$pref] $count 件登録"
  total=$((total + count))
  success=$((success + 1))
done

echo ""
echo "=== 完了 ==="
echo "都道府県数: $success"
echo "合計レコード数: $total"
