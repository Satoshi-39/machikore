/**
 * ActionSheet/Alertユーティリティ
 *
 * 編集・削除メニューの表示ロジックを共通化
 */

import { Alert, ActionSheetIOS, Platform } from 'react-native';

interface EditDeleteMenuOptions {
  onEdit: () => void;
  onDelete: () => void;
  title?: string;
}

/**
 * 編集・削除メニューを表示
 * iOS: ActionSheetIOS、Android: Alert
 */
export function showEditDeleteMenu({
  onEdit,
  onDelete,
  title = 'メニュー',
}: EditDeleteMenuOptions): void {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['キャンセル', '編集', '削除'],
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          onEdit();
        } else if (buttonIndex === 2) {
          onDelete();
        }
      }
    );
  } else {
    Alert.alert(title, '', [
      { text: 'キャンセル', style: 'cancel' },
      { text: '編集', onPress: onEdit },
      { text: '削除', style: 'destructive', onPress: onDelete },
    ]);
  }
}

interface ConfirmDeleteOptions {
  title: string;
  message: string;
  onConfirm: () => void;
}

/**
 * 削除確認ダイアログを表示
 */
export function showDeleteConfirmation({
  title,
  message,
  onConfirm,
}: ConfirmDeleteOptions): void {
  Alert.alert(title, message, [
    { text: 'キャンセル', style: 'cancel' },
    { text: '削除', style: 'destructive', onPress: onConfirm },
  ]);
}
