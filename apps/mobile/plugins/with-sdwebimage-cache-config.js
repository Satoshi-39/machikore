/**
 * Expo Config Plugin: SDWebImage メモリキャッシュ上限設定
 *
 * expo-image (SDK 53) が内部で使用する SDWebImage のメモリキャッシュはデフォルト無制限。
 * フォアグラウンド継続時にメモリが肥大化するため、AppDelegate で上限を設定する。
 *
 * SDK 55 以降は公式の Image.configureCache() API に移行可能。
 */
const { withAppDelegate } = require('@expo/config-plugins');

/** メモリキャッシュの上限コスト（バイト） */
const DEFAULT_MAX_MEMORY_COST = 100 * 1024 * 1024; // 100MB
/** メモリキャッシュの最大画像数 */
const DEFAULT_MAX_MEMORY_COUNT = 50;

function withSDWebImageCacheConfig(config, options = {}) {
  const maxMemoryCost = options.maxMemoryCost ?? DEFAULT_MAX_MEMORY_COST;
  const maxMemoryCount = options.maxMemoryCount ?? DEFAULT_MAX_MEMORY_COUNT;

  return withAppDelegate(config, (config) => {
    let contents = config.modResults.contents;

    // import SDWebImage を追加（重複防止）
    if (!contents.includes('import SDWebImage')) {
      contents = contents.replace(
        'import Expo',
        'import Expo\nimport SDWebImage'
      );
    }

    // didFinishLaunchingWithOptions 内の return super の直前に設定を挿入
    const cacheConfigCode = `
    // [with-sdwebimage-cache-config] メモリキャッシュ上限設定
    SDImageCache.shared.config.maxMemoryCost = UInt(${maxMemoryCost})
    SDImageCache.shared.config.maxMemoryCount = UInt(${maxMemoryCount})
`;

    if (!contents.includes('SDImageCache.shared.config.maxMemoryCost')) {
      contents = contents.replace(
        'return super.application(application, didFinishLaunchingWithOptions: launchOptions)',
        `${cacheConfigCode}    return super.application(application, didFinishLaunchingWithOptions: launchOptions)`
      );
    }

    config.modResults.contents = contents;
    return config;
  });
}

module.exports = withSDWebImageCacheConfig;
