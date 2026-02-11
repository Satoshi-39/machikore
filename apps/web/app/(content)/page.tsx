import {
  getTodayPicks,
  getPopularMaps,
  getNewMaps,
} from "@/shared/api/supabase/maps";
import { getCategories } from "@/shared/api/supabase/categories";
import { HeroSection } from "@/widgets/hero-section";
import { TodayPicksSection } from "@/widgets/today-picks-section";
import { PopularMapsSection } from "@/widgets/popular-maps-section";
import { CategorySection } from "@/widgets/category-section";
import { NewMapsSection } from "@/widgets/new-maps-section";

export default async function Page() {
  const [todayPicks, popularMaps, newMaps, categories] = await Promise.all([
    getTodayPicks(10),
    getPopularMaps(8),
    getNewMaps(),
    getCategories(),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4">
      <HeroSection />
      <TodayPicksSection maps={todayPicks} />
      <PopularMapsSection maps={popularMaps} />
      <CategorySection categories={categories} />
      <NewMapsSection maps={newMaps} />
    </div>
  );
}
