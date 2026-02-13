import {
  getTodayPicks,
  getPopularMaps,
  getNewMaps,
} from "@/shared/api/supabase/maps";
import { getCategories } from "@/shared/api/supabase/categories";
import { ENV } from "@/shared/config";
import { HomePage } from "@/pages/home";

export default async function Page() {
  if (!ENV.ENABLE_CONTENT) {
    return <HomePage enableContent={false} />;
  }

  const [todayPicks, popularMaps, newMaps, categories] = await Promise.all([
    getTodayPicks(10),
    getPopularMaps(8),
    getNewMaps(),
    getCategories(),
  ]);

  return (
    <HomePage
      enableContent
      todayPicks={todayPicks}
      popularMaps={popularMaps}
      newMaps={newMaps}
      categories={categories}
    />
  );
}
