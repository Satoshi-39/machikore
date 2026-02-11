import { Heart, Bookmark, MessageCircle } from "lucide-react";

type ArticleActionsProps = {
  likesCount: number;
  bookmarksCount: number;
  commentsCount: number;
};

export function ArticleActions({
  likesCount,
  bookmarksCount,
  commentsCount,
}: ArticleActionsProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-t text-sm text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Heart className="h-4 w-4" />
        {likesCount}
      </span>
      <span className="flex items-center gap-1.5">
        <Bookmark className="h-4 w-4" />
        {bookmarksCount}
      </span>
      <span className="flex items-center gap-1.5">
        <MessageCircle className="h-4 w-4" />
        {commentsCount}
      </span>
    </div>
  );
}
