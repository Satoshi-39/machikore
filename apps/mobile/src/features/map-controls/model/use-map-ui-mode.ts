/**
 * マップUIモードの状態管理フック
 *
 * カルーセル・詳細カード・通常状態を1つのenumで管理し、
 * 現在地ボタンの位置と表示を一元管理する
 *
 * 既存のuseSelectUserMapCardの状態を受け取り、現在地ボタンの制御を行う
 * BottomSheetの高さ変化はコールバックで受け取り、リアルタイムでopacityを更新
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { duration as durationTokens } from '@/shared/config';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

/** マップUIの状態 */
export type MapUIMode =
  | 'normal'              // 通常（カルーセルも詳細カードもない）
  | 'carousel'            // カルーセル表示中
  | 'detail-small'        // 詳細カード小（12%）
  | 'detail-medium'       // 詳細カード中（45%）
  | 'detail-large';       // 詳細カード大（90%）

/** 詳細カードのスナップインデックス → モードのマッピング */
const SNAP_INDEX_TO_MODE: Record<number, MapUIMode> = {
  0: 'detail-small',
  1: 'detail-medium',
  2: 'detail-large',
};

/** 現在地ボタンの位置定義（bottom値） */
const LOCATION_BUTTON_POSITIONS: Record<MapUIMode, number> = {
  'normal': 48,                                        // 通常位置
  'carousel': -100,                                    // 画面外（非表示）
  'detail-small': SCREEN_HEIGHT * 0.11 + 16,          // 詳細カード「小」(12%)の上
  'detail-medium': SCREEN_HEIGHT * 0.11 + 16,         // 位置は同じ、opacityで制御
  'detail-large': SCREEN_HEIGHT * 0.11 + 16,          // 位置は同じ、opacityで制御
};

/** 現在地ボタンのopacity定義（スナップ確定時） */
const LOCATION_BUTTON_OPACITY: Record<MapUIMode, number> = {
  'normal': 1,
  'carousel': 0,
  'detail-small': 1,
  'detail-medium': 0,    // フェードアウト
  'detail-large': 0,     // フェードアウト
};

/** 現在地ボタンがタッチ可能かどうか */
const LOCATION_BUTTON_TOUCHABLE: Record<MapUIMode, boolean> = {
  'normal': true,
  'carousel': false,
  'detail-small': true,
  'detail-medium': false,
  'detail-large': false,
};

interface UseMapUIModeOptions {
  /** 詳細カードが開いているか（useSelectUserMapCardから） */
  isDetailCardOpen: boolean;
  /** カルーセルが表示されているか（useSelectUserMapCardから） */
  isCarouselVisible: boolean;
  /** スポットがあるか */
  hasSpots: boolean;
  /** 初期状態で現在地ボタンを非表示にするか（initialSpotIdがある場合にtrue） */
  initiallyHidden?: boolean;
}

interface UseMapUIModeReturn {
  /** 現在のUIモード */
  mode: MapUIMode;
  /** 詳細カードのスナップ変更ハンドラー（SpotDetailCardのonSnapChangeに渡す） */
  handleSnapChange: (snapIndex: number) => void;
  /** 現在地ボタンのbottom位置 */
  locationButtonBottom: number;
  /** 現在地ボタンのアニメーションスタイル */
  locationButtonAnimatedStyle: { opacity: number };
  /** 現在地ボタンがタッチ可能か */
  isLocationButtonTouchable: boolean;
  /** 現在地ボタンを表示すべきか（カルーセル表示中は非表示） */
  shouldShowLocationButton: boolean;
  /** 詳細カードが最大化されているか */
  isDetailCardMaximized: boolean;
  /** カード閉じる前に呼ぶ（opacityを0にする） */
  handleBeforeCardClose: () => void;
  /** カード開く時に呼ぶ（opacityを0で開始） */
  handleCardOpen: () => void;
  /** 現在地ボタンの表示/非表示通知（高さベース、SpotDetailCardから呼ばれる） */
  handleLocationButtonVisibilityChange: (isVisible: boolean) => void;
}

export function useMapUIMode({
  isDetailCardOpen,
  isCarouselVisible,
  hasSpots,
  initiallyHidden = false,
}: UseMapUIModeOptions): UseMapUIModeReturn {
  // opacityのアニメーション値（initiallyHiddenの場合は最初から0）
  const opacityValue = useSharedValue(initiallyHidden ? 0 : 1);
  // カード閉じる処理中フラグ
  const isClosingRef = useRef(false);
  // 現在のスナップインデックス（詳細カードのサイズ）
  const snapIndexRef = useRef(1); // デフォルトはmedium
  // 現在地ボタンがタッチ可能かどうか（高さベースで更新、再レンダリング必要なのでstate）
  const [isTouchable, setIsTouchable] = useState(!initiallyHidden);

  // 現在のモードを計算
  const mode = useMemo((): MapUIMode => {
    if (isDetailCardOpen) {
      return SNAP_INDEX_TO_MODE[snapIndexRef.current] || 'detail-medium';
    }
    if (isCarouselVisible && hasSpots) {
      return 'carousel';
    }
    return 'normal';
  }, [isDetailCardOpen, isCarouselVisible, hasSpots]);

  // スナップ変更ハンドラー（スナップ確定時に呼ばれる）
  const handleSnapChange = useCallback((snapIndex: number) => {
    snapIndexRef.current = snapIndex;
    // スナップ確定時は高さベースの通知で既にopacityが更新されているはずなので、
    // ここでは何もしない（二重更新を防ぐ）
  }, []);

  // 現在地ボタンの表示/非表示通知（高さベース、リアルタイム）
  const handleLocationButtonVisibilityChange = useCallback((isVisible: boolean) => {
    // 閉じる処理中は無視
    if (isClosingRef.current) return;

    setIsTouchable(isVisible);
    opacityValue.value = withTiming(isVisible ? 1 : 0, { duration: durationTokens.fast });
  }, [opacityValue]);

  // カード閉じる前のハンドラー
  const handleBeforeCardClose = useCallback(() => {
    isClosingRef.current = true;
    opacityValue.value = withTiming(0, { duration: durationTokens.fast });
  }, [opacityValue]);

  // カード開く時のハンドラー（ちらつき防止）
  const handleCardOpen = useCallback(() => {
    isClosingRef.current = false;
    snapIndexRef.current = 1; // mediumにリセット
    setIsTouchable(false);
    opacityValue.value = 0; // 最初は非表示（高さベースの通知で表示される）
  }, [opacityValue]);

  // モード変更時にopacityを更新（詳細カードが閉じた時など）
  useEffect(() => {
    // 詳細カードが閉じた時（normal or carousel）
    if (!isDetailCardOpen) {
      // 閉じる処理完了、フラグをリセット
      isClosingRef.current = false;
      const targetOpacity = LOCATION_BUTTON_OPACITY[mode];
      setIsTouchable(LOCATION_BUTTON_TOUCHABLE[mode]);
      opacityValue.value = withTiming(targetOpacity, { duration: durationTokens.fast });
    }
  }, [mode, isDetailCardOpen, opacityValue]);

  // アニメーションスタイル
  const locationButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacityValue.value,
  }));

  // 現在地ボタンを表示すべきか（カルーセル表示中は非表示にする）
  const shouldShowLocationButton = !(isCarouselVisible && !isDetailCardOpen && hasSpots);

  // タッチ可能かどうか（高さベースの更新を反映）
  const isLocationButtonTouchable = isDetailCardOpen
    ? isTouchable
    : LOCATION_BUTTON_TOUCHABLE[mode];

  return {
    mode,
    handleSnapChange,
    locationButtonBottom: LOCATION_BUTTON_POSITIONS[mode],
    locationButtonAnimatedStyle,
    isLocationButtonTouchable,
    shouldShowLocationButton,
    isDetailCardMaximized: mode === 'detail-large',
    handleBeforeCardClose,
    handleCardOpen,
    handleLocationButtonVisibilityChange,
  };
}
