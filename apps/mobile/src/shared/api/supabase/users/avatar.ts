/**
 * アバター関連API
 */

/**
 * アバター画像をアップロード
 * Edge Function経由でアップロード（スポット画像と同じ方式）
 */
export async function uploadAvatar(
  userId: string,
  file: { uri: string; type: string; name: string }
): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const filePath = `${userId}/${Date.now()}.${fileExt}`;

  // 共通のuploadImage関数を使用
  const { uploadImage, STORAGE_BUCKETS } = await import('../storage');

  const result = await uploadImage({
    uri: file.uri,
    bucket: STORAGE_BUCKETS.AVATARS,
    path: filePath,
    contentType: file.type,
  });

  if (!result.success) {
    throw result.error || new Error('アバターのアップロードに失敗しました');
  }

  return result.data.url;
}
