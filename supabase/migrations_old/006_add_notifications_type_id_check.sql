-- notifications テーブルに type と ID カラムの整合性チェック制約を追加

ALTER TABLE public.notifications
ADD CONSTRAINT notifications_type_id_check CHECK (
  (type IN ('like_spot', 'comment_spot') AND user_spot_id IS NOT NULL) OR
  (type IN ('like_map', 'comment_map') AND map_id IS NOT NULL) OR
  (type = 'follow' AND actor_id IS NOT NULL) OR
  (type = 'system')
);
