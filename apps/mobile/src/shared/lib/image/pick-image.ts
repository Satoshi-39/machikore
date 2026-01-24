/**
 * 画像選択・アップロード共通ユーティリティ
 *
 * 権限リクエスト、ActionSheet表示、画像選択の共通ロジック
 */

import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform, ActionSheetIOS } from 'react-native';

/**
 * カメラまたはライブラリの権限をリクエスト
 * @returns 権限が許可されたかどうか
 */
export async function requestImagePermission(type: 'camera' | 'library'): Promise<boolean> {
  if (type === 'camera') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '権限が必要です',
        'カメラを使用するには、設定からカメラへのアクセスを許可してください。'
      );
      return false;
    }
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '権限が必要です',
        '写真を選択するには、設定から写真ライブラリへのアクセスを許可してください。'
      );
      return false;
    }
  }
  return true;
}

/**
 * 画像追加メニューを表示（iOS: ActionSheet, Android: Alert）
 * @param onCamera カメラ選択時のコールバック
 * @param onLibrary ライブラリ選択時のコールバック
 */
export function showImagePickerMenu(
  onCamera: () => void,
  onLibrary: () => void
): void {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['キャンセル', 'カメラで撮影', 'ライブラリから選択'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          onCamera();
        } else if (buttonIndex === 2) {
          onLibrary();
        }
      }
    );
  } else {
    Alert.alert('画像を追加', '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: 'カメラで撮影', onPress: onCamera },
      { text: 'ライブラリから選択', onPress: onLibrary },
    ]);
  }
}

/**
 * 画像上限エラーを表示
 * @param maxImages 最大画像数
 */
export function showImageLimitAlert(maxImages: number): void {
  Alert.alert(
    '上限に達しました',
    `1つのスポットにつき最大${maxImages}枚まで追加できます`
  );
}

/**
 * 画像アップロードエラーを表示
 */
export function showImageUploadErrorAlert(): void {
  Alert.alert('エラー', '画像のアップロードに失敗しました');
}

/**
 * 画像処理エラーを表示
 */
export function showImageProcessErrorAlert(): void {
  Alert.alert('エラー', '画像の処理に失敗しました');
}

/**
 * スポット情報取得エラーを表示
 */
export function showSpotNotFoundAlert(): void {
  Alert.alert('エラー', 'スポット情報が取得できません');
}
