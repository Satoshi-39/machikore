/**
 * YouTube関連のユーティリティ関数
 */

/**
 * YouTubeのURLからvideo IDを抽出
 *
 * 対応形式:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 */
export function extractYoutubeVideoId(url: string): string | null {
  const pattern =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;

  const match = url.match(pattern);
  return match?.[1] ?? null;
}

/**
 * YouTubeのURLが有効かどうかを判定
 */
export function isValidYoutubeUrl(url: string): boolean {
  return extractYoutubeVideoId(url) !== null;
}
