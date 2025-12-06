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
import { useUserStore } from '../model/use-user-store';

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
      queryClient.setQueryData(['user', updatedUser.id], updatedUser);
      // ユーザー一覧系のキャッシュも無効化
      queryClient.invalidateQueries({ queryKey: ['user', updatedUser.id] });
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
