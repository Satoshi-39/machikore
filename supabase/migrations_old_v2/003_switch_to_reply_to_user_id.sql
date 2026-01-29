-- Instagram/Note方式への変更：reply_to_comment_id → reply_to_user_id
-- 「どのコメントへの返信か」ではなく「誰への返信か」を追跡する

-- 1. reply_to_user_idカラムを追加（まだ存在しない場合）
ALTER TABLE public.comments
ADD COLUMN IF NOT EXISTS reply_to_user_id uuid REFERENCES public.users(id) ON DELETE SET NULL;

-- 2. インデックスを追加
CREATE INDEX IF NOT EXISTS comments_reply_to_user_id_idx ON public.comments(reply_to_user_id);

-- 3. コメント
COMMENT ON COLUMN public.comments.reply_to_user_id IS '返信先のユーザーID（誰への返信かを示す、Instagram方式）';

-- 4. reply_to_comment_idカラムを削除
DROP INDEX IF EXISTS comments_reply_to_comment_id_idx;
ALTER TABLE public.comments DROP COLUMN IF EXISTS reply_to_comment_id;
