import Image from "next/image";
import { MapPin } from "lucide-react";
import type { SpotWithImages } from "@/shared/types";
import { ProseMirrorRenderer } from "@/shared/lib/prosemirror/ProseMirrorRenderer";
import { extractLocalizedValue } from "@/shared/lib/multilang";

type ArticleSpotSectionProps = {
  spot: SpotWithImages;
  index: number;
  supabaseUrl: string;
};

function getSpotName(spot: SpotWithImages): string {
  // ピン刺し・現在地登録の場合のスポット名（TEXT型）
  if (spot.name) return spot.name;
  // マスタースポットの名前（JSONB型）
  if (spot.master_spot?.name) {
    return extractLocalizedValue(spot.master_spot.name, spot.language) || "スポット";
  }
  return "スポット";
}

function getSpotAddress(spot: SpotWithImages): string | null {
  // ピン刺し・現在地登録の場合の住所
  const shortAddress =
    spot.google_short_address || spot.master_spot?.google_short_address;
  if (shortAddress) {
    return extractLocalizedValue(shortAddress, spot.language);
  }
  return null;
}

function getImageUrl(cloudPath: string, supabaseUrl: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${cloudPath}`;
}

export function ArticleSpotSection({
  spot,
  index,
  supabaseUrl,
}: ArticleSpotSectionProps) {
  const spotName = getSpotName(spot);
  const address = getSpotAddress(spot);

  return (
    <section className="py-6 border-t">
      {/* Spot Header */}
      <div className="flex items-start gap-3 mb-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0">
          {index}
        </span>
        <div>
          <h3 className="text-base font-bold">{spotName}</h3>
          {address && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="h-3 w-3" />
              {address}
            </p>
          )}
        </div>
      </div>

      {/* Spot Images */}
      {spot.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {spot.images.map((image) =>
            image.cloud_path ? (
              <Image
                key={image.id}
                src={getImageUrl(image.cloud_path, supabaseUrl)}
                alt={spotName}
                width={320}
                height={192}
                className="h-48 w-auto rounded-lg object-cover flex-shrink-0"
              />
            ) : null
          )}
        </div>
      )}

      {/* Description */}
      {spot.description && (
        <p className="text-sm text-muted-foreground mb-3">{spot.description}</p>
      )}

      {/* Article Content */}
      <ProseMirrorRenderer content={spot.article_content} />
    </section>
  );
}
