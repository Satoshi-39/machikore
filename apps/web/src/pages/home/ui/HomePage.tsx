import { HeroSection } from "@/widgets/hero-section";
import { FeaturesSection } from "@/widgets/features-section";
import { ShowcaseSection } from "@/widgets/showcase-section";
import { FaqSection } from "@/widgets/faq-section";
import { BottomCtaSection } from "@/widgets/bottom-cta-section";
import { TodayPicksSection } from "@/widgets/today-picks-section";
import { PopularMapsSection } from "@/widgets/popular-maps-section";
import { CategorySection } from "@/widgets/category-section";
import { NewMapsSection } from "@/widgets/new-maps-section";
import type { MapWithUser } from "@/shared/types/composite.types";
import type { Database } from "@machikore/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];

type HomePageProps = {
  enableContent: boolean;
  todayPicks?: MapWithUser[];
  popularMaps?: MapWithUser[];
  newMaps?: MapWithUser[];
  categories?: Category[];
};

export function HomePage({
  enableContent,
  todayPicks = [],
  popularMaps = [],
  newMaps = [],
  categories = [],
}: HomePageProps) {
  if (!enableContent) {
    return (
      <div className="max-w-7xl mx-auto px-4">
        <HeroSection />
        <FeaturesSection />
        <ShowcaseSection />
        <FaqSection />
        <BottomCtaSection />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <HeroSection />
      <TodayPicksSection maps={todayPicks} />
      <PopularMapsSection maps={popularMaps} />
      <CategorySection categories={categories} />
      <NewMapsSection maps={newMaps} />
    </div>
  );
}
