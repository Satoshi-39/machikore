import { requireNativeModule } from 'expo-modules-core';

interface MapMemoryManagerNativeModule {
  setTileCacheBudget(megabytes: number): void;
  setPrefetchZoomDelta(delta: number): void;
  reduceMemoryUse(): void;
}

const NativeModule =
  requireNativeModule<MapMemoryManagerNativeModule>('MapMemoryManager');

/**
 * インメモリタイルキャッシュの上限をMB単位で設定
 * 上限を超えた場合、最も古いタイルがLRUで自動削除される
 */
export function setTileCacheBudget(megabytes: number): void {
  NativeModule.setTileCacheBudget(megabytes);
}

/**
 * タイルプリフェッチのズームデルタを設定
 * デフォルト4 → 2に下げるとプリフェッチ量が半減しメモリ削減
 * 0にするとプリフェッチ無効（ズームアウト時に白くなる可能性）
 */
export function setPrefetchZoomDelta(delta: number): void {
  NativeModule.setPrefetchZoomDelta(delta);
}

/**
 * 非必須のキャッシュリソースをメモリから解放
 * マップ画面から離れた時に呼ぶことでメモリ使用量を削減
 */
export function reduceMemoryUse(): void {
  NativeModule.reduceMemoryUse();
}
