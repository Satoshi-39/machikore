/**
 * タグエンティティ
 */

export {
  usePopularTags,
  useTagSearch,
  useMapTags,
  useSpotTags,
  useUpdateMapTags,
  useUpdateSpotTags,
} from './api/use-tags';

export type { Tag } from '@/shared/api/supabase/tags';
