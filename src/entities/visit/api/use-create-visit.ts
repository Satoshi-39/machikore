/**
 * 訪問記録を作成するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateVisits } from '@/shared/api/query-client';
import {
  getVisitByUserAndMachi,
  insertVisit,
  incrementVisitCount,
  getMachiById,
} from '@/shared/api/sqlite';
import {
  createVisitData,
  validateCreateVisitParams,
} from '../model';
import type { CreateVisitParams } from '../model/types';

/**
 * 訪問記録を作成または更新
 */
export function useCreateVisit() {
  return useMutation({
    mutationFn: async (params: CreateVisitParams) => {
      // バリデーション
      const validation = validateCreateVisitParams(params);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      // 街情報を取得
      const machi = getMachiById(params.stationId);
      if (!machi) {
        throw new Error('街が見つかりません');
      }

      // 既存の訪問記録をチェック
      const existingVisit = getVisitByUserAndMachi(
        params.userId,
        params.stationId
      );

      let visitId: string;

      if (existingVisit) {
        // 既存の場合は訪問回数をインクリメント
        incrementVisitCount(existingVisit.id, params.visitedAt || new Date().toISOString());
        visitId = existingVisit.id;
      } else {
        // 新規作成
        const newVisit = createVisitData(params);
        insertVisit(newVisit);
        visitId = newVisit.id;
      }

      // NOTE: 以前は自動投稿を作成していましたが、Spotアーキテクチャに移行したため削除

      return visitId;
    },
    onSuccess: () => {
      // 訪問記録のキャッシュを無効化
      invalidateVisits();
    },
  });
}
