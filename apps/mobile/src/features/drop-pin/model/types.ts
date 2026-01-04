/**
 * ピン刺し Feature 型定義
 */

import type { SpotColor } from '@/shared/config';

/**
 * ピンの位置
 */
export interface PinLocation {
  latitude: number;
  longitude: number;
}

/**
 * ピン刺しモードの状態
 */
export interface PinDropState {
  /** ピン刺しモードが有効かどうか */
  isActive: boolean;
  /** 落としたピンの位置 */
  droppedPin: PinLocation | null;
  /** ピン刺しモードを開始 */
  startPinDropMode: () => void;
  /** ピン刺しモードを終了 */
  endPinDropMode: () => void;
  /** ピンを落とす */
  dropPin: (location: PinLocation) => void;
  /** ピンをクリア */
  clearPin: () => void;
  /** すべてリセット */
  reset: () => void;
}

/**
 * ピン刺しオーバーレイのProps
 */
export interface PinDropOverlayProps {
  /** 確定ボタン押下時 */
  onConfirm: () => void;
  /** キャンセルボタン押下時 */
  onCancel: () => void;
  /** スポットの色（オプション、デフォルトは青） */
  spotColor?: SpotColor;
}
