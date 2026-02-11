import type { MapArticleData } from "@/shared/types";
import { ProseMirrorRenderer } from "@/shared/lib/prosemirror/ProseMirrorRenderer";
import { ArticleHero } from "./ArticleHero";
import { ArticleAuthor } from "./ArticleAuthor";
import { ArticleSpotSection } from "./ArticleSpotSection";
import { ArticleActions } from "./ArticleActions";

type MapArticleContentProps = {
  data: MapArticleData;
  supabaseUrl: string;
};

export function MapArticleContent({
  data,
  supabaseUrl,
}: MapArticleContentProps) {
  const { map, spots } = data;

  return (
    <article className="max-w-3xl mx-auto">
      <ArticleHero
        thumbnailUrl={map.thumbnail_url}
        thumbnailCrop={map.thumbnail_crop}
        mapName={map.name}
      />

      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold">{map.name}</h1>

        <ArticleAuthor
          user={map.user}
          createdAt={map.created_at}
          spotsCount={map.spots_count}
          likesCount={map.likes_count}
        />

        {map.description && (
          <p className="mt-4 text-sm text-muted-foreground">
            {map.description}
          </p>
        )}

        <ProseMirrorRenderer content={map.article_intro} className="mt-4" />

        {spots.map((spot, i) => (
          <ArticleSpotSection
            key={spot.id}
            spot={spot}
            index={i + 1}
            supabaseUrl={supabaseUrl}
          />
        ))}

        <ProseMirrorRenderer content={map.article_outro} className="mt-4" />

        {/* Tags */}
        {map.tags && map.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {map.tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full bg-secondary px-3 py-1 text-xs"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <ArticleActions
          likesCount={map.likes_count}
          bookmarksCount={map.bookmarks_count}
          commentsCount={map.comments_count}
        />
      </div>
    </article>
  );
}
