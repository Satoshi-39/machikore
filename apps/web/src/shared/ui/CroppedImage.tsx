import Image from "next/image";
import type { ThumbnailCrop } from "@/shared/types";

type CroppedImageProps = {
  src: string;
  alt: string;
  crop: ThumbnailCrop;
  /** コンテナのアスペクト比 (width / height)。デフォルト: 16/9 */
  aspectRatio?: number;
  /** コンテナに追加するクラス */
  className?: string;
  /** Next.js Image の sizes (レスポンシブ最適化用) */
  sizes?: string;
};

/**
 * cropデータに基づいて画像の一部を切り出して表示するコンポーネント
 *
 * overflow: hidden のコンテナ内に、スケール・オフセットした画像を配置して
 * クロップ領域だけを見せる。パーセンテージベースでレスポンシブ対応。
 */
export function CroppedImage({
  src,
  alt,
  crop,
  aspectRatio = 16 / 9,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
}: CroppedImageProps) {
  // コンテナ幅を基準にスケール計算し、パーセンテージで表現
  // width/left: コンテナ幅に対する割合
  // height/top: コンテナ高さに対する割合（aspectRatio で変換）
  const widthPercent = (crop.imageWidth / crop.width) * 100;
  const heightPercent = ((crop.imageHeight * aspectRatio) / crop.width) * 100;
  const leftPercent = (-crop.originX / crop.width) * 100;
  const topPercent = ((-crop.originY * aspectRatio) / crop.width) * 100;

  return (
    <div
      className={`overflow-hidden relative ${className}`}
      style={{ aspectRatio }}
    >
      <div
        style={{
          position: "absolute",
          width: `${widthPercent}%`,
          height: `${heightPercent}%`,
          left: `${leftPercent}%`,
          top: `${topPercent}%`,
        }}
      >
        <Image src={src} alt={alt} fill sizes={sizes} />
      </div>
    </div>
  );
}
