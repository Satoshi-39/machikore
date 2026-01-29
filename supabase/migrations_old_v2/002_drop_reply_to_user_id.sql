-- reply_to_user_idカラムを削除
-- reply_to_comment_idで代替するため不要

-- インデックスを削除
DROP INDEX IF EXISTS comments_reply_to_user_id_idx;

-- カラムを削除
ALTER TABLE public.comments
DROP COLUMN IF EXISTS reply_to_user_id;
