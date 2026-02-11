import type { Category } from "@/shared/api/supabase/categories";

type CategorySectionProps = {
  categories: Category[];
};

export function CategorySection({ categories }: CategorySectionProps) {
  if (categories.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-4">カテゴリから探す</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category.id}
            className="rounded-full border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition-colors cursor-default"
          >
            {category.name}
          </span>
        ))}
      </div>
    </section>
  );
}
