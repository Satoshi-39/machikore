/**
 * タブのインデックスページ
 *
 * /(tabs) へのアクセスは initialRouteName: 'home'（_layout.tsx）で制御。
 * ここで <Redirect> を使うと、dismissAll() 時にタブ状態が一瞬リセットされた際に
 * Redirect が発火してホームタブに強制遷移してしまう問題があるため、null を返す。
 */

export default function TabsIndex() {
  return null;
}
