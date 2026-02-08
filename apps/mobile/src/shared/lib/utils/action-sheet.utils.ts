/**
 * ActionSheet/Alertユーティリティ
 *
 * 編集・削除メニューの表示ロジックを共通化
 */

import { Alert, ActionSheetIOS, Platform } from 'react-native';
import { t } from '@/shared/lib/i18n';

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
  title = t('actionSheet.menu') ?? '',
}: EditDeleteMenuOptions): void {
  if (Platform.OS === 'ios') {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [t('common.cancel'), t('common.edit'), t('common.delete')],
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
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.edit'), onPress: onEdit },
      { text: t('common.delete'), style: 'destructive', onPress: onDelete },
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
    { text: t('common.cancel'), style: 'cancel' },
    { text: t('common.delete'), style: 'destructive', onPress: onConfirm },
  ]);
}
