/**
 * プロフィール更新hook
 *
 * ユーザープロフィール（表示名、自己紹介、アバター）を更新
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  updateUserProfile,
  uploadAvatar,
  type ProfileUpdateData,
} from '@/shared/api/supabase/users';
import { deleteImage, STORAGE_BUCKETS } from '@/shared/api/supabase/storage';
import { QUERY_KEYS } from '@/shared/api/query-client';
import { useUserStore } from '../model/use-user-store';
import { log } from '@/shared/config/logger';

interface UpdateProfileParams {
  userId: string;
  data: ProfileUpdateData;
}

interface UploadAvatarParams {
  userId: string;
  file: { uri: string; type: string; name: string };
}

/**
 * プロフィール更新mutation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateStoreProfile = useUserStore((state) => state.updateProfile);

  return useMutation({
    mutationFn: ({ userId, data }: UpdateProfileParams) =>
      updateUserProfile(userId, data),
    onSuccess: (updatedUser) => {
      // ユーザー情報のキャッシュを更新
      queryClient.setQueryData(QUERY_KEYS.usersDetail(updatedUser.id), updatedUser);
      // ユーザー一覧系のキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.usersDetail(updatedUser.id) });
      // Zustand ストアも更新（AsyncStorageに永続化される）
      updateStoreProfile({
        display_name: updatedUser.display_name,
        bio: updatedUser.bio,
        avatar_url: updatedUser.avatar_url,
      });
    },
  });
}

/**
 * アバター画像アップロードmutation
 */
export function useUploadAvatar() {
  return useMutation({
    mutationFn: ({ userId, file }: UploadAvatarParams) =>
      uploadAvatar(userId, file),
  });
}

/**
 * Supabase Storage URLからパスを抽出
 */
function extractPathFromUrl(url: string, bucket: string): string | null {
  try {
    const pattern = new RegExp(`/storage/v1/object/public/${bucket}/(.+)$`);
    const match = url.match(pattern);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * プロフィール更新（アバターアップロード含む）の複合hook
 */
export function useUpdateProfileWithAvatar() {
  const updateProfileMutation = useUpdateProfile();
  const uploadAvatarMutation = useUploadAvatar();

  const updateProfile = async (
    userId: string,
    data: ProfileUpdateData,
    avatarFile?: { uri: string; type: string; name: string }
  ) => {
    let avatarUrl = data.avatar_url;

    // アバター画像がある場合は先にアップロード
    if (avatarFile) {
      // 古いアバターがあればS3から削除
      if (data.avatar_url) {
        const oldPath = extractPathFromUrl(data.avatar_url, STORAGE_BUCKETS.AVATARS);
        if (oldPath) {
          const deleteResult = await deleteImage(STORAGE_BUCKETS.AVATARS, oldPath);
          if (!deleteResult.success) {
            log.warn('[useUpdateProfileWithAvatar] 古いアバターのS3削除に失敗しましたが、処理は続行します:', deleteResult.error);
          } else {
            log.debug('[useUpdateProfileWithAvatar] 古いアバターをS3から削除:', oldPath);
          }
        }
      }

      avatarUrl = await uploadAvatarMutation.mutateAsync({
        userId,
        file: avatarFile,
      });
    }

    // プロフィールを更新
    return updateProfileMutation.mutateAsync({
      userId,
      data: { ...data, avatar_url: avatarUrl },
    });
  };

  return {
    updateProfile,
    isLoading:
      updateProfileMutation.isPending || uploadAvatarMutation.isPending,
    error: updateProfileMutation.error || uploadAvatarMutation.error,
  };
}
