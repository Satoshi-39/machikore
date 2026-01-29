-- Migration: Add language column to maps and user_spots tables
-- Purpose: Store detected language for user-generated content

-- Add language column to maps table
-- Stores ISO 639-1 language code (e.g., 'ja', 'en', 'zh', 'ko')
ALTER TABLE public.maps
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT NULL;

-- Add language column to user_spots table
-- Inherits from parent map at creation time for efficient querying
ALTER TABLE public.user_spots
ADD COLUMN IF NOT EXISTS language VARCHAR(10) DEFAULT NULL;

-- Add indexes for language-based filtering
CREATE INDEX IF NOT EXISTS idx_maps_language ON public.maps(language);
CREATE INDEX IF NOT EXISTS idx_user_spots_language ON public.user_spots(language);

-- Comments for documentation
COMMENT ON COLUMN public.maps.language IS 'Detected language code (ISO 639-1) for content filtering';
COMMENT ON COLUMN public.user_spots.language IS 'Language code inherited from parent map';

-- Trigger: Sync language from maps to user_spots when map language changes
CREATE OR REPLACE FUNCTION sync_spots_language()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.language IS DISTINCT FROM OLD.language THEN
    UPDATE public.user_spots
    SET language = NEW.language
    WHERE map_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_spots_language
AFTER UPDATE OF language ON public.maps
FOR EACH ROW
EXECUTE FUNCTION sync_spots_language();
