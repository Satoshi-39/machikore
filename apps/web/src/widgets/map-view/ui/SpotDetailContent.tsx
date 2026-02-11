import Image from "next/image";
import type { SpotWithImages } from "@/shared/types";
import { extractLocalizedValue } from "@/shared/lib/multilang";
import { ProseMirrorRenderer } from "@/shared/lib/prosemirror/ProseMirrorRenderer";
import { Heart, MessageCircle } from "lucide-react";

type SpotDetailContentProps = {
  spot: SpotWithImages;
  supabaseUrl: string;
};

function getSpotName(spot: SpotWithImages): string {
  if (spot.master_spot) {
    return (
      extractLocalizedValue(spot.master_spot.name) ||
      spot.description ||
      "スポット"
    );
  }
  return spot.name || spot.description || "スポット";
}

function getSpotAddress(spot: SpotWithImages): string | null {
  const address =
    spot.master_spot?.google_short_address ?? spot.google_short_address;
  return extractLocalizedValue(address);
}

export function SpotDetailContent({
  spot,
  supabaseUrl,
}: SpotDetailContentProps) {
  const spotName = getSpotName(spot);
  const address = getSpotAddress(spot);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold">{spotName}</h3>
        {address && (
          <p className="text-sm text-muted-foreground mt-1">{address}</p>
        )}
      </div>

      {spot.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto">
          {spot.images.map((img) =>
            img.cloud_path ? (
              <Image
                key={img.id}
                src={`${supabaseUrl}/storage/v1/object/public/${img.cloud_path}`}
                alt={spotName}
                width={267}
                height={160}
                className="h-40 w-auto rounded-lg object-cover flex-shrink-0"
              />
            ) : null
          )}
        </div>
      )}

      {spot.description && (
        <p className="text-sm">{spot.description}</p>
      )}

      <ProseMirrorRenderer content={spot.article_content ?? null} />

      <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2 border-t">
        <span className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          {spot.likes_count}
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          {spot.comments_count}
        </span>
      </div>
    </div>
  );
}
