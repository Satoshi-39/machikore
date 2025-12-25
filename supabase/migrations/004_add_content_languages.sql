-- Migration: Add content_languages column to user_preferences
-- Purpose: Store user's preferred content languages for filtering posts

-- Add content_languages column (array of language codes)
-- Default: empty array means "show all languages"
ALTER TABLE public.user_preferences
ADD COLUMN IF NOT EXISTS content_languages text[] DEFAULT ARRAY[]::text[];

-- Comment for documentation
COMMENT ON COLUMN public.user_preferences.content_languages IS 'コンテンツ言語フィルター: 見たい言語コードの配列（空配列=全言語表示）';
