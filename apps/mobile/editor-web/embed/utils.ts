/**
 * 埋め込みプレビュー生成の共通ユーティリティ
 */

/**
 * ローディング表示を作成
 */
export function createLoadingElement(providerName: string): HTMLElement {
  const container = document.createElement('div');
  container.style.cssText = `
    padding: 20px;
    background-color: #f7f9fa;
    border: 1px solid #e1e8ed;
    border-radius: 12px;
    text-align: center;
    color: #536471;
  `;
  container.textContent = `${providerName}を読み込み中...`;
  return container;
}

/**
 * サムネイル付きプレビュー（YouTube等）を作成
 */
export function createThumbnailPreview(
  providerName: string,
  thumbnailUrl: string
): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-embed', '');
  container.className = 'embed-container';
  container.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 16px auto;
    cursor: pointer;
  `;

  // サムネイル画像
  const thumbnail = document.createElement('img');
  thumbnail.src = thumbnailUrl;
  thumbnail.alt = `${providerName} thumbnail`;
  thumbnail.style.cssText = `
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    border-radius: 8px;
    display: block;
    background-color: #000;
  `;

  // 再生ボタンオーバーレイ
  const playButton = document.createElement('div');
  playButton.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 68px;
    height: 48px;
    background-color: rgba(0, 0, 0, 0.8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  const playIcon = document.createElement('div');
  playIcon.style.cssText = `
    width: 0;
    height: 0;
    border-left: 18px solid white;
    border-top: 11px solid transparent;
    border-bottom: 11px solid transparent;
    margin-left: 4px;
  `;

  playButton.appendChild(playIcon);
  container.appendChild(thumbnail);
  container.appendChild(playButton);

  return container;
}

/**
 * OGPリンクカードのプレビューを作成（エディタ内表示用）
 */
export function createOgpLinkCardPreview(
  url: string,
  ogTitle: string | null,
  ogDescription: string | null,
  ogImage: string | null
): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-embed', '');
  container.className = 'embed-container';
  container.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 16px 0;
    cursor: pointer;
    background-color: rgba(128, 128, 128, 0.06);
    border: 1px solid rgba(128, 128, 128, 0.25);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    box-sizing: border-box;
  `;

  // 左: サムネイル画像（ある場合）
  if (ogImage) {
    const imageWrapper = document.createElement('div');
    imageWrapper.style.cssText = `
      width: 120px;
      min-width: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      background-color: rgba(128, 128, 128, 0.1);
    `;

    const img = document.createElement('img');
    img.src = ogImage;
    img.alt = ogTitle ?? '';
    img.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
    `;
    img.onerror = () => {
      imageWrapper.style.display = 'none';
    };

    imageWrapper.appendChild(img);
    container.appendChild(imageWrapper);
  }

  // 右: テキスト情報
  const textWrapper = document.createElement('div');
  textWrapper.style.cssText = `
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    background-color: transparent;
  `;

  // タイトル
  const titleEl = document.createElement('div');
  titleEl.textContent = ogTitle || url;
  titleEl.style.cssText = `
    font-weight: 600;
    font-size: 14px;
    line-height: 1.4;
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    background-color: transparent;
  `;
  textWrapper.appendChild(titleEl);

  // 説明文
  if (ogDescription) {
    const descEl = document.createElement('div');
    descEl.textContent = ogDescription;
    descEl.style.cssText = `
      font-size: 12px;
      line-height: 1.4;
      color: inherit;
      opacity: 0.6;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      background-color: transparent;
    `;
    textWrapper.appendChild(descEl);
  }

  // ホスト名
  try {
    const hostname = new URL(url).hostname;
    const hostEl = document.createElement('div');
    hostEl.textContent = hostname;
    hostEl.style.cssText = `
      font-size: 11px;
      color: inherit;
      opacity: 0.45;
      margin-top: 2px;
      background-color: transparent;
    `;
    textWrapper.appendChild(hostEl);
  } catch {
    // URL解析失敗時はホスト名を表示しない
  }

  container.appendChild(textWrapper);

  return container;
}

/** マップアイコン SVG（Ionicons map-outline相当） */
const MAP_ICON_SVG = `<svg viewBox="0 0 512 512" width="16" height="16" fill="none" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"><path d="M313.27 124.64L198.73 51.36a32 32 0 00-29.28.35L56.51 127.49A16 16 0 0048 141.63v295.8a16 16 0 0023.49 14.13l97.82-63.79a32 32 0 0129.5-.35l114.54 73.28a32 32 0 0029.28-.35l112.94-75.78A16 16 0 00464 370.37V74.57a16 16 0 00-23.49-14.13l-97.82 63.79a32 32 0 01-29.42.41z"/><line x1="328" y1="128" x2="328" y2="464"/><line x1="184" y1="48" x2="184" y2="384"/></svg>`;

/** スポットアイコン SVG（Ionicons location-outline相当） */
const SPOT_ICON_SVG = `<svg viewBox="0 0 512 512" width="16" height="16" fill="none" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"><path d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"/><circle cx="256" cy="192" r="48"/></svg>`;

/** サムネイルクロップ座標 */
type CropData = {
  originX: number;
  originY: number;
  width: number;
  height: number;
  imageWidth: number;
  imageHeight: number;
};

/**
 * マップ/スポットカードのプレビューを作成（エディタ内表示用）
 */
export function createMapSpotCardPreview(
  provider: 'map_card' | 'spot_card',
  title: string,
  description: string | null,
  thumbnailUrl: string | null,
  thumbnailCrop?: CropData | null
): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-embed', '');
  container.className = 'embed-container';
  container.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 16px 0;
    cursor: pointer;
    background-color: rgba(128, 128, 128, 0.06);
    border: 1px solid rgba(128, 128, 128, 0.25);
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    box-sizing: border-box;
  `;

  // 左: サムネイル画像（ある場合）
  if (thumbnailUrl) {
    const IMG_W = 120;
    const IMG_H = 96;
    const imageWrapper = document.createElement('div');
    imageWrapper.style.cssText = `
      width: ${IMG_W}px;
      min-width: ${IMG_W}px;
      height: ${IMG_H}px;
      overflow: hidden;
      background-color: rgba(128, 128, 128, 0.1);
    `;

    if (thumbnailCrop) {
      // クロップ領域をbackground-imageで表示（absolute配置はWebViewレイアウトに影響するため避ける）
      const sX = IMG_W / thumbnailCrop.width;
      const sY = IMG_H / thumbnailCrop.height;
      const s = Math.max(sX, sY);
      const bgW = thumbnailCrop.imageWidth * s;
      const bgH = thumbnailCrop.imageHeight * s;
      const cropCenterX = thumbnailCrop.originX + thumbnailCrop.width / 2;
      const cropCenterY = thumbnailCrop.originY + thumbnailCrop.height / 2;
      const bgX = IMG_W / 2 - cropCenterX * s;
      const bgY = IMG_H / 2 - cropCenterY * s;
      imageWrapper.style.backgroundImage = `url(${thumbnailUrl})`;
      imageWrapper.style.backgroundSize = `${Math.ceil(bgW)}px ${Math.ceil(bgH)}px`;
      imageWrapper.style.backgroundPosition = `${Math.floor(bgX)}px ${Math.floor(bgY)}px`;
      imageWrapper.style.backgroundRepeat = 'no-repeat';
    } else {
      // クロップなし: img要素でobject-fit: cover
      const img = document.createElement('img');
      img.src = thumbnailUrl;
      img.alt = title;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
      `;
      img.onerror = () => {
        imageWrapper.style.display = 'none';
      };
      imageWrapper.appendChild(img);
    }

    container.appendChild(imageWrapper);
  }

  // 右: テキスト情報
  const textWrapper = document.createElement('div');
  textWrapper.style.cssText = `
    flex: 1;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
    background-color: transparent;
  `;

  // タイトル行（アイコン + 名前）
  const titleRow = document.createElement('div');
  titleRow.style.cssText = `
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: transparent;
  `;

  const iconWrapper = document.createElement('div');
  iconWrapper.style.cssText = `
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  `;
  iconWrapper.innerHTML = provider === 'map_card' ? MAP_ICON_SVG : SPOT_ICON_SVG;

  const titleEl = document.createElement('div');
  titleEl.textContent = title;
  titleEl.style.cssText = `
    font-weight: 600;
    font-size: 14px;
    line-height: 1.4;
    color: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background-color: transparent;
  `;

  titleRow.appendChild(iconWrapper);
  titleRow.appendChild(titleEl);
  textWrapper.appendChild(titleRow);

  // 説明文
  if (description) {
    const descEl = document.createElement('div');
    descEl.textContent = description;
    descEl.style.cssText = `
      font-size: 12px;
      line-height: 1.4;
      color: inherit;
      opacity: 0.6;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      background-color: transparent;
    `;
    textWrapper.appendChild(descEl);
  }

  // machikore.io
  const hostEl = document.createElement('div');
  hostEl.textContent = 'machikore.io';
  hostEl.style.cssText = `
    font-size: 11px;
    color: inherit;
    opacity: 0.45;
    margin-top: 2px;
    background-color: transparent;
  `;
  textWrapper.appendChild(hostEl);

  container.appendChild(textWrapper);

  return container;
}

/**
 * リンクカード形式のプレビューを作成
 */
export function createLinkCardPreview(
  providerName: string,
  url: string,
  iconSvg: string
): HTMLElement {
  const container = document.createElement('div');
  container.setAttribute('data-embed', '');
  container.className = 'embed-container';
  container.style.cssText = `
    position: relative;
    width: 100%;
    max-width: 100%;
    margin: 16px 0;
    cursor: pointer;
    padding: 16px;
    background-color: rgba(128, 128, 128, 0.1);
    border: 1px solid rgba(128, 128, 128, 0.3);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-sizing: border-box;
  `;

  // ヘッダー（アイコン + プロバイダー名）
  const header = document.createElement('div');
  header.style.cssText = `
    display: flex;
    align-items: center;
    gap: 8px;
    background-color: transparent;
  `;

  // プロバイダーアイコン
  const iconWrapper = document.createElement('div');
  iconWrapper.style.cssText = `
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  `;
  iconWrapper.innerHTML = iconSvg;

  const providerLabel = document.createElement('div');
  providerLabel.textContent = providerName;
  providerLabel.style.cssText = `
    font-weight: 600;
    font-size: 14px;
    color: inherit;
    background-color: transparent;
  `;

  header.appendChild(iconWrapper);
  header.appendChild(providerLabel);

  // URL表示
  const urlLabel = document.createElement('div');
  urlLabel.textContent = url;
  urlLabel.style.cssText = `
    font-size: 13px;
    color: inherit;
    opacity: 0.6;
    word-break: break-all;
    line-height: 1.4;
    background-color: transparent;
  `;

  container.appendChild(header);
  container.appendChild(urlLabel);

  return container;
}
