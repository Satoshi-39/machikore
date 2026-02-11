import Link from "next/link";
import Image from "next/image";
import { MapPin, Heart } from "lucide-react";
import type { MapWithUser } from "@/shared/types";
import { CroppedImage } from "@/shared/ui/CroppedImage";

type MapCardProps = {
  map: MapWithUser;
};

export function MapCard({ map }: MapCardProps) {
  const username = map.user?.username;
  if (!username) return null;

  const href = `/${username}/maps/${map.id}`;
  const thumbnailCrop = map.thumbnail_crop;

  return (
    <Link href={href} className="group block">
      <article className="rounded-lg border bg-card overflow-hidden transition-shadow hover:shadow-md">
        {/* Thumbnail */}
        {map.thumbnail_url && thumbnailCrop ? (
          <CroppedImage
            src={map.thumbnail_url}
            alt={map.name}
            crop={thumbnailCrop}
            aspectRatio={16 / 9}
            className="bg-muted"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="aspect-[16/9] overflow-hidden bg-muted">
            {map.thumbnail_url ? (
              <Image
                src={map.thumbnail_url}
                alt={map.name}
                width={640}
                height={360}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-3">
          <h3 className="font-bold text-sm line-clamp-2">{map.name}</h3>
          {map.description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {map.description}
            </p>
          )}

          {/* Author */}
          <div className="mt-2 flex items-center gap-1.5">
            {map.user?.avatar_url && map.user.avatar_crop ? (
              <CroppedImage
                src={map.user.avatar_url}
                alt={map.user.display_name || map.user.username}
                crop={map.user.avatar_crop}
                aspectRatio={1}
                className="h-5 w-5 rounded-full"
                sizes="20px"
              />
            ) : map.user?.avatar_url ? (
              <Image
                src={map.user.avatar_url}
                alt={map.user.display_name || map.user.username}
                width={20}
                height={20}
                className="h-5 w-5 rounded-full object-cover"
              />
            ) : (
              <div className="h-5 w-5 rounded-full bg-muted" />
            )}
            <span className="text-xs text-muted-foreground truncate">
              {map.user?.display_name || map.user?.username}
            </span>
          </div>

          {/* Stats */}
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {map.spots_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              {map.likes_count}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
