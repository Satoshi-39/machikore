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
