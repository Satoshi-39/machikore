/**
 * 訪問記録を更新するhook
 */

import { useMutation } from '@tanstack/react-query';
import { invalidateVisits } from '@/shared/api/query-client';
import { supabase } from '@/shared/api/supabase/client';
import type { UpdateVisitParams } from '../model/types';

/**
 * 訪問記録を更新
 */
export function useUpdateVisit() {
  return useMutation({
    mutationFn: async (params: UpdateVisitParams) => {
      const updateData: { visited_at?: string } = {};

      if (params.visitedAt) {
        updateData.visited_at = params.visitedAt;
      }

      const { error } = await supabase
        .from('visits')
        .update(updateData)
        .eq('id', params.visitId);

      if (error) {
        console.error('Error updating visit:', error);
        throw error;
      }

      return params.visitId;
    },
    onSuccess: () => {
      invalidateVisits();
    },
  });
}
