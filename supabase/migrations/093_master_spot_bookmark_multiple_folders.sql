-- =============================================
-- ブックマークを複数フォルダに対応
-- スポット、マップ、マスタースポット全てで複数フォルダへの追加を可能にする
--
-- 変更内容:
-- - (user_id, spot_id) → (user_id, spot_id, folder_id)
-- - (user_id, map_id) → (user_id, map_id, folder_id)
-- - (user_id, master_spot_id) → (user_id, master_spot_id, folder_id)
--
-- これにより同じアイテムを異なるフォルダに追加可能
-- 同じアイテムを同じフォルダに2回追加することは不可
-- =============================================

-- 既存のユニークインデックスを削除
DROP INDEX IF EXISTS bookmarks_user_spot_unique;
DROP INDEX IF EXISTS bookmarks_user_map_unique;
DROP INDEX IF EXISTS bookmarks_user_master_spot_unique;

-- 新しいユニークインデックスを作成（folder_idを含む）
-- folder_idがNULLの場合も一意になるようにCOALESCEを使用

-- スポット: 同じスポットを同じフォルダに2回追加不可
CREATE UNIQUE INDEX bookmarks_user_spot_folder_unique
ON bookmarks (user_id, spot_id, COALESCE(folder_id, '00000000-0000-0000-0000-000000000000'::uuid))
WHERE spot_id IS NOT NULL;

-- マップ: 同じマップを同じフォルダに2回追加不可
CREATE UNIQUE INDEX bookmarks_user_map_folder_unique
ON bookmarks (user_id, map_id, COALESCE(folder_id, '00000000-0000-0000-0000-000000000000'::uuid))
WHERE map_id IS NOT NULL;

-- マスタースポット: 同じマスタースポットを同じフォルダに2回追加不可
CREATE UNIQUE INDEX bookmarks_user_master_spot_folder_unique
ON bookmarks (user_id, master_spot_id, COALESCE(folder_id, '00000000-0000-0000-0000-000000000000'::uuid))
WHERE master_spot_id IS NOT NULL;
