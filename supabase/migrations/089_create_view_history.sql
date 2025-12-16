-- 閲覧履歴テーブル作成
-- マップの閲覧履歴を保存し、最近見たマップ表示やレコメンドに活用

-- テーブル作成
CREATE TABLE IF NOT EXISTS public.view_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  map_id UUID NOT NULL REFERENCES public.maps(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  view_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, map_id)
);

-- コメント追加
COMMENT ON TABLE public.view_history IS '閲覧履歴（マップ）';
COMMENT ON COLUMN public.view_history.user_id IS '閲覧したユーザーID';
COMMENT ON COLUMN public.view_history.map_id IS '閲覧したマップID';
COMMENT ON COLUMN public.view_history.viewed_at IS '最終閲覧日時';
COMMENT ON COLUMN public.view_history.view_count IS '閲覧回数';

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_view_history_user_id ON public.view_history(user_id);
CREATE INDEX IF NOT EXISTS idx_view_history_map_id ON public.view_history(map_id);
CREATE INDEX IF NOT EXISTS idx_view_history_viewed_at ON public.view_history(viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_view_history_user_viewed ON public.view_history(user_id, viewed_at DESC);

-- RLS有効化
ALTER TABLE public.view_history ENABLE ROW LEVEL SECURITY;

-- RLSポリシー: 自分の履歴は読み取り可能
CREATE POLICY "Users can view their own history"
  ON public.view_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLSポリシー: 自分の履歴は作成可能
CREATE POLICY "Users can insert their own history"
  ON public.view_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLSポリシー: 自分の履歴は更新可能
CREATE POLICY "Users can update their own history"
  ON public.view_history
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLSポリシー: 自分の履歴は削除可能
CREATE POLICY "Users can delete their own history"
  ON public.view_history
  FOR DELETE
  USING (auth.uid() = user_id);

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION public.update_view_history_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_view_history_updated_at
  BEFORE UPDATE ON public.view_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_view_history_updated_at();

-- 閲覧を記録するUPSERT関数（同じマップを見たらviewed_atとview_countを更新）
CREATE OR REPLACE FUNCTION public.record_map_view(
  p_user_id UUID,
  p_map_id UUID
)
RETURNS void AS $$
BEGIN
  INSERT INTO public.view_history (user_id, map_id, viewed_at, view_count)
  VALUES (p_user_id, p_map_id, now(), 1)
  ON CONFLICT (user_id, map_id)
  DO UPDATE SET
    viewed_at = now(),
    view_count = view_history.view_count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
