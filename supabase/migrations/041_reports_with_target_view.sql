-- 通報一覧用ビュー: 対象コンテンツの名前 + 通報者情報を解決
-- カラム構造を変更する場合はDROP + CREATEが必要（PostgreSQLの制約）
DROP VIEW IF EXISTS reports_with_target;
CREATE VIEW reports_with_target AS
SELECT
  r.id,
  r.reason,
  r.description,
  r.status,
  r.target_type,
  r.target_id,
  r.created_at,
  r.updated_at,
  r.resolved_at,
  r.resolved_by,
  r.admin_notes,
  CASE r.target_type
    WHEN 'map' THEN m.name
    WHEN 'spot' THEN COALESCE(us.name, us.description)
    WHEN 'user' THEN tu.display_name
    WHEN 'comment' THEN LEFT(c.content, 50)
  END AS target_name,
  reporter.id AS reporter_id,
  reporter.username AS reporter_username,
  reporter.display_name AS reporter_display_name
FROM reports r
LEFT JOIN maps m ON r.target_type = 'map' AND r.target_id = m.id
LEFT JOIN user_spots us ON r.target_type = 'spot' AND r.target_id = us.id
LEFT JOIN users tu ON r.target_type = 'user' AND r.target_id = tu.id
LEFT JOIN comments c ON r.target_type = 'comment' AND r.target_id = c.id
LEFT JOIN users reporter ON r.reporter_id = reporter.id;
