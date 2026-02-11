import Image from "next/image";
import { MapPin, Heart } from "lucide-react";
import type { UserBasicInfo } from "@/shared/types";
import { CroppedImage } from "@/shared/ui/CroppedImage";

type ArticleAuthorProps = {
  user: UserBasicInfo | null;
  createdAt: string;
  spotsCount: number;
  likesCount: number;
};

export function ArticleAuthor({
  user,
  createdAt,
  spotsCount,
  likesCount,
}: ArticleAuthorProps) {
  const date = new Date(createdAt).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center justify-between py-4 border-b">
      <div className="flex items-center gap-2">
        {user?.avatar_url && user.avatar_crop ? (
          <CroppedImage
            src={user.avatar_url}
            alt={user.display_name || user.username}
            crop={user.avatar_crop}
            aspectRatio={1}
            className="h-8 w-8 rounded-full"
            sizes="32px"
          />
        ) : user?.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={user.display_name || user.username}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted" />
        )}
        <div>
          <p className="text-sm font-medium">
            {user?.display_name || user?.username || "不明"}
          </p>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {spotsCount}
        </span>
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          {likesCount}
        </span>
      </div>
    </div>
  );
}
