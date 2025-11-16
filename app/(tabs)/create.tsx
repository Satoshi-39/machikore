/**
 * 作成タブ（ダミー）
 *
 * このページは実際には表示されません
 * タブレイアウトの listeners.tabPress で
 * モーダル (/create-menu) に遷移します
 */

import { View } from 'react-native';

export default function CreateTab() {
  // タブアイコンを表示するためだけのダミーページ
  // 実際の処理は app/create-menu.tsx で行われる
  return <View className="flex-1 bg-white" />;
}
