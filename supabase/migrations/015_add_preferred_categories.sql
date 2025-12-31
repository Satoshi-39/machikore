-- user_preferencesテーブルに好みのカテゴリを追加

-- 好みのカテゴリ配列カラムを追加（最大3つ）
ALTER TABLE user_preferences
ADD COLUMN IF NOT EXISTS preferred_categories TEXT[] DEFAULT ARRAY[]::TEXT[];

-- コメント
COMMENT ON COLUMN user_preferences.preferred_categories IS '好みのカテゴリID（最大3つ、オンボーディングで収集）';

-- チェック制約（最大3つ）
ALTER TABLE user_preferences
ADD CONSTRAINT user_preferences_preferred_categories_max_3
  CHECK (array_length(preferred_categories, 1) IS NULL OR array_length(preferred_categories, 1) <= 3);
