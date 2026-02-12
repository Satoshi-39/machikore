import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Globe,
  Map,
  Hash,
  Building,
} from "lucide-react";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { getMachiDetail } from "@/entities/machi";
import { getPlaceTypeLabel } from "@/shared/config";

type MachiDetailPageProps = {
  machiId: string;
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function MachiDetailPage({ machiId }: MachiDetailPageProps) {
  const machi = await getMachiDetail(machiId);

  if (!machi) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/machi">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">街詳細</h1>
      </div>

      {/* Machi Info Card */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
            <MapPin className="h-6 w-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold">{machi.name}</h2>
              {machi.place_type && (
                <Badge
                  variant="secondary"
                  className="bg-gray-100 text-gray-700"
                >
                  {getPlaceTypeLabel(machi.place_type)}
                </Badge>
              )}
            </div>
            {machi.name_kana && (
              <p className="mt-1 text-gray-500">{machi.name_kana}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-gray-500" />
            <span>{machi.spots_count} スポット</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Building className="h-4 w-4" />
              都道府県
            </div>
            <p className="mt-1 font-medium">{machi.prefecture_name}</p>
            {machi.prefecture_name_translations && (
              <div className="mt-1 text-sm text-gray-500">
                {Object.entries(machi.prefecture_name_translations).map(
                  ([lang, name]) => (
                    <span key={lang} className="mr-2">
                      {lang}: {name}
                    </span>
                  )
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Building className="h-4 w-4" />
              市区町村
            </div>
            {machi.city_name ? (
              <>
                <p className="mt-1 font-medium">{machi.city_name}</p>
                {machi.city_name_translations && (
                  <div className="mt-1 text-sm text-gray-500">
                    {Object.entries(machi.city_name_translations).map(
                      ([lang, name]) => (
                        <span key={lang} className="mr-2">
                          {lang}: {name}
                        </span>
                      )
                    )}
                  </div>
                )}
              </>
            ) : (
              <p className="mt-1 text-gray-400">-</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Globe className="h-4 w-4" />
              翻訳
            </div>
            {machi.name_translations ? (
              <div className="mt-1 space-y-1">
                {Object.entries(machi.name_translations).map(([lang, name]) => (
                  <p key={lang} className="text-sm">
                    <span className="text-gray-500">{lang}:</span>{" "}
                    <span className="font-medium">{name}</span>
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-1 text-gray-400">-</p>
            )}
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="h-4 w-4" />
              作成日時
            </div>
            <p className="mt-1 font-medium">{formatDate(machi.created_at)}</p>
            <p className="text-sm text-gray-500">
              更新: {formatDate(machi.updated_at)}
            </p>
          </div>
        </div>

        {/* Coordinates */}
        {machi.latitude && machi.longitude && (
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-500 mb-2">座標</div>
            <div className="flex items-center gap-4 text-sm">
              <span>緯度: {machi.latitude}</span>
              <span>経度: {machi.longitude}</span>
              <a
                href={`https://www.google.com/maps?q=${machi.latitude},${machi.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Mapで開く
              </a>
            </div>
          </div>
        )}

        {/* Technical Info */}
        <div className="mt-6 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
            <Hash className="h-4 w-4" />
            技術情報
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">ID:</span>{" "}
              <span className="font-mono">{machi.id}</span>
            </div>
            {machi.osm_id && (
              <div>
                <span className="text-gray-500">OSM ID:</span>{" "}
                <a
                  href={`https://www.openstreetmap.org/node/${machi.osm_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-blue-600 hover:underline"
                >
                  {machi.osm_id}
                </a>
              </div>
            )}
            {machi.tile_id && (
              <div>
                <span className="text-gray-500">Tile ID:</span>{" "}
                <span className="font-mono">{machi.tile_id}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
