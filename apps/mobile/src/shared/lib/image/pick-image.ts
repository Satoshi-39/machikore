/**
 * 画像選択・アップロード共通ユーティリティ
 *
 * 権限リクエスト、ActionSheet表示、画像選択の共通ロジック
 */

import * as ImagePicker from 'expo-image-picker';
import { Alert, Platform, ActionSheetIOS, Linking } from 'react-native';
import { t } from '@/shared/lib/i18n';

/**
 * カメラまたはライブラリの権限をリクエスト
 * @returns 権限が許可されたかどうか
 */
export async function requestImagePermission(type: 'camera' | 'library'): Promise<boolean> {
  if (type === 'camera') {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('imagePicker.permissionRequired'),
        t('imagePicker.cameraPermission'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('imagePicker.openSettings'), onPress: () => Linking.openSettings() },
        ]
      );
      return false;
    }
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        t('imagePicker.permissionRequired'),
        t('imagePicker.libraryPermission'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('imagePicker.openSettings'), onPress: () => Linking.openSettings() },
        ]
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
        options: [t('common.cancel'), t('imagePicker.takePhoto'), t('imagePicker.chooseFromLibrary')],
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
    Alert.alert(t('imagePicker.addImage'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('imagePicker.takePhoto'), onPress: onCamera },
      { text: t('imagePicker.chooseFromLibrary'), onPress: onLibrary },
    ]);
  }
}

/**
 * 画像上限エラーを表示
 * @param maxImages 最大画像数
 */
export function showImageLimitAlert(maxImages: number): void {
  Alert.alert(
    t('imagePicker.limitReached'),
    t('imagePicker.limitMessage', { max: maxImages })
  );
}

/**
 * 画像アップロードエラーを表示
 */
export function showImageUploadErrorAlert(): void {
  Alert.alert(t('common.error'), t('imagePicker.uploadError'));
}

/**
 * 画像処理エラーを表示
 */
export function showImageProcessErrorAlert(): void {
  Alert.alert(t('common.error'), t('imagePicker.processError'));
}

/**
 * スポット情報取得エラーを表示
 */
export function showSpotNotFoundAlert(): void {
  Alert.alert(t('common.error'), t('imagePicker.spotNotFound'));
}
