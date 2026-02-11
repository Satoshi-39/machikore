import Image from "next/image";
import { MapPin } from "lucide-react";
import type { ThumbnailCrop } from "@/shared/types";
import { CroppedImage } from "@/shared/ui/CroppedImage";

type ArticleHeroProps = {
  thumbnailUrl: string | null;
  thumbnailCrop: ThumbnailCrop | null;
  mapName: string;
};

export function ArticleHero({
  thumbnailUrl,
  thumbnailCrop,
  mapName,
}: ArticleHeroProps) {
  if (thumbnailUrl && thumbnailCrop) {
    return (
      <CroppedImage
        src={thumbnailUrl}
        alt={mapName}
        crop={thumbnailCrop}
        aspectRatio={16 / 9}
        className="bg-muted"
        sizes="(max-width: 768px) 100vw, 768px"
      />
    );
  }

  return (
    <div className="aspect-video overflow-hidden bg-muted relative">
      {thumbnailUrl ? (
        <Image
          src={thumbnailUrl}
          alt={mapName}
          fill
          className="object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <MapPin className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
