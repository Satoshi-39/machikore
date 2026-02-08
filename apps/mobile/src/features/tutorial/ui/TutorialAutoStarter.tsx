/**
 * チュートリアル自動開始コンポーネント
 *
 * shouldStartTutorial フラグを監視し、trueになったらコーチマークを開始する。
 * CopilotProvider の内側に配置する必要がある。
 */

import { useEffect, useRef } from 'react';
import { useCopilot } from 'react-native-copilot';
import { useTutorialStore } from '@/shared/lib/store';
import { log } from '@/shared/config/logger';

export function TutorialAutoStarter() {
  const { start, copilotEvents } = useCopilot();
  const shouldStartTutorial = useTutorialStore(
    (state) => state.shouldStartTutorial
  );
  const markTutorialSeen = useTutorialStore((state) => state.markTutorialSeen);
  const clearStartRequest = useTutorialStore(
    (state) => state.clearStartRequest
  );
  const startAttempted = useRef(false);

  // チュートリアル停止時にフラグを更新
  useEffect(() => {
    const handleStop = () => {
      log.debug('[Tutorial] コーチマーク終了');
      markTutorialSeen();
      startAttempted.current = false;
    };

    copilotEvents.on('stop', handleStop);
    return () => {
      copilotEvents.off('stop', handleStop);
    };
  }, [copilotEvents, markTutorialSeen]);

  // shouldStartTutorial フラグ監視 → コーチマーク開始
  useEffect(() => {
    if (!shouldStartTutorial || startAttempted.current) return;

    startAttempted.current = true;
    // タブバーのレンダリング完了を待つ
    const timer = setTimeout(async () => {
      try {
        log.debug('[Tutorial] コーチマーク開始');
        await start();
      } catch (err) {
        log.warn('[Tutorial] コーチマーク開始エラー:', err);
        clearStartRequest();
        startAttempted.current = false;
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [shouldStartTutorial, start, clearStartRequest]);

  return null;
}
