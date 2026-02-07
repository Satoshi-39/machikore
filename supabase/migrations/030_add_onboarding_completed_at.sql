-- オンボーディング完了状態を明示的に管理するカラムを追加
-- デモグラフィックをスキップした場合でも、再起動時にオンボーディングが再表示されないようにする

ALTER TABLE public.users
ADD COLUMN onboarding_completed_at timestamptz DEFAULT NULL;

-- 既存ユーザー対応:
-- username が自動生成パターン（user_ + id先頭8文字）と異なるユーザーは
-- オンボーディング完了済みとみなし、現在時刻を設定する
UPDATE public.users
SET onboarding_completed_at = NOW()
WHERE username != 'user_' || LEFT(id::text, 8);
