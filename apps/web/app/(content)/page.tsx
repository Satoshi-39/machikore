import {
  getTodayPicks,
  getPopularMaps,
  getNewMaps,
} from "@/shared/api/supabase/maps";
import { getCategories } from "@/shared/api/supabase/categories";
import { ENV } from "@/shared/config";
import { HeroSection } from "@/widgets/hero-section";
import { TodayPicksSection } from "@/widgets/today-picks-section";
import { PopularMapsSection } from "@/widgets/popular-maps-section";
import { CategorySection } from "@/widgets/category-section";
import { NewMapsSection } from "@/widgets/new-maps-section";

function FeaturesSection() {
  const features = [
    {
      title: "スポットを記録",
      description:
        "お気に入りのカフェ、レストラン、公園など、あなたの街の「好き」を写真付きで記録できます。",
    },
    {
      title: "マップにまとめる",
      description:
        "テーマごとにスポットをマップにまとめて、自分だけのコレクションを作りましょう。",
    },
    {
      title: "みんなと共有",
      description:
        "作成したマップを公開して、あなたの「好き」を誰かの次の冒険のきっかけに。",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
        街コレでできること
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature) => (
          <div key={feature.title} className="text-center px-4">
            <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function Page() {
  if (!ENV.ENABLE_CONTENT) {
    return (
      <div className="max-w-6xl mx-auto px-4">
        <HeroSection />
        <FeaturesSection />
      </div>
    );
  }

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
