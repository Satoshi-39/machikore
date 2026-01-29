-- コメントに返信先コメントIDカラムを追加
-- フラット表示で実際の返信先コメントを追跡するために使用

-- reply_to_comment_idカラムを追加
ALTER TABLE public.comments
ADD COLUMN reply_to_comment_id uuid REFERENCES public.comments(id) ON DELETE SET NULL;

-- インデックスを追加（返信先コメントでの検索用）
CREATE INDEX IF NOT EXISTS comments_reply_to_comment_id_idx ON public.comments(reply_to_comment_id);

-- コメント
COMMENT ON COLUMN public.comments.reply_to_comment_id IS '返信先のコメントID（どのコメントへの返信かを追跡）';
