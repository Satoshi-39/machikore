# SharedMapView（シングルトンMapView）アーキテクチャ

## 概要

Mapbox MapViewをアプリ全体で1つだけ保持し、`react-native-teleport`のPortalで各画面に物理的に移動させるアーキテクチャ。

**導入目的**: 画面ごとにMapViewを生成するとメモリ消費が大きく、複数マップ間のナビゲーションでOOMクラッシュが発生していた。シングルトン化によりMapViewインスタンスを1つに制限し、メモリ使用量を大幅に削減。

## 構成ファイル

```
shared/lib/map/
├── shared-map-store.ts       # Zustandストア（状態管理の中核）
├── use-shared-map-ready.ts   # MapView初期化完了フック
├── index.ts                  # re-export

widgets/shared-map-view/
└── ui/SharedMapViewContainer.tsx  # シングルトンMapView本体（app/_layoutに配置）

widgets/user-map-view/
├── model/use-sync-to-shared-map.ts  # 各画面→ストアへのデータ同期
├── model/use-user-map-data.ts       # マップデータ取得・GeoJSON生成
├── model/use-spot-camera.ts         # カメラ操作（フィット・移動）
└── ui/user-map-view.tsx             # PortalHostを持つ画面側Widget
```

## データフロー

```
┌─────────────────┐     Zustand Store      ┌──────────────────────┐
│  UserMapView     │  ──── GeoJSON ────▶   │  SharedMapViewContainer │
│  (各画面)         │  ──── 選択状態 ────▶   │  (シングルトン)          │
│                  │  ──── イベントCB ──▶   │                        │
│  PortalHost ◀════╪══ Portal teleport ═══╪═ Portal               │
└─────────────────┘                        └──────────────────────┘
```

1. **各画面（UserMapView）** が `useSyncToSharedMap` でストアにデータを書き込む
2. **SharedMapViewContainer** がストアをsubscribeし、GeoJSON・選択状態を反映
3. `react-native-teleport` の Portal/PortalHost でMapViewを画面間で物理移動

## Portal Teleport の仕組み

- `SharedMapViewContainer` は `<Portal hostName={activeHostName}>` でラップ
- 各画面の `UserMapView` は `<PortalHost name={hostName}>` を持つ
- `activeHostName` を変更するとネイティブビューが物理的に再配置される
- **重要**: この再配置は非同期。完了前に `setCamera` を呼んでも効かない

## カメラ状態の保存・復元

マップ間を行き来した時にカメラ位置を維持するための仕組み。

### 保存（blur時）

```
useFocusEffect cleanup → saveCameraState(mapId, { centerCoordinate, zoomLevel })
```

ストアの `centerCoords` / `currentZoomLevel` を `savedCameraStates[mapId]` に保存。

### 復元（focus時）

```
useFocusEffect → getSavedCameraState(mapId) → setTimeout(150) → setCamera
```

- `setTimeout(150)` はPortal teleportのネイティブ再配置完了を待つため
- `react-native-teleport` にteleport完了コールバックがないため、遅延で対処
- `user-map-view.tsx` の初回フィット（`setTimeout(100)`）と同じパターン

### 高速切り替え対策

```typescript
setTimeout(() => {
  // この画面がまだアクティブか確認
  const currentMapId = useSharedMapStore.getState().activeMapId;
  if (currentMapId !== mapId) return; // スキップ
  sharedCameraRef.current?.setCamera({ ... });
}, 150);
```

A→B→Cと高速切り替えした場合、BのsetTimeoutが発火しても `activeMapId !== B` でスキップされる。

## Opacityマスク

カメラ復元の150ms間に古いカメラ位置が見えるのを防ぐ仕組み。

- **保存済みカメラがある場合**: focus時に `isTransitioning = true` → MapView opacity: 0
- **カメラ復元完了後**: `isTransitioning = false` → 150ms fade-inで表示
- **初回訪問（保存済みカメラなし）**: `isTransitioning` は変更しない → 通常表示

```
SharedMapViewContainer:
  <Animated.View style={{ opacity: opacityAnim }}>
    <Mapbox.MapView>...</Mapbox.MapView>
  </Animated.View>
```

## イベント転送

MapViewはシングルトンだが、イベントは各画面固有のハンドラに転送される。

```
SharedMapViewContainer                  useSyncToSharedMap
  onCameraChanged ──▶ store.onCameraChanged ──▶ onCameraChangedRef.current
  onSpotPress     ──▶ store.onSpotPress     ──▶ onSpotPressRef.current
```

- ハンドラはref経由で登録（useFocusEffectのdeps安定化のため）
- blur時にハンドラをnullクリア（古いコールバックの実行防止）

## activeHostNameのクリアタイミング

```
useFocusEffect cleanup → ハンドラクリアのみ（activeHostNameはクリアしない）
useEffect cleanup       → activeHostNameをクリア（アンマウント時のみ）
```

**理由**: useFocusEffectのcleanupでactiveHostNameをクリアすると、Portal teleport解除（ネイティブ再配置）が発生し、モーダル表示中のReact Navigationスタック状態に干渉する。

## FitAllボタンのフォールバック

高速切り替え等でスポットが表示されない場合のフォールバック。

```typescript
// FitAllButton onPress
useSharedMapStore.getState().updateGeoJson({
  spotsGeoJson, transportHubsGeoJson, citiesGeoJson, prefecturesGeoJson,
});
fitCameraToAllSpots(filteredSpots);
```

GeoJSONをストアに再書き込みすることで、レイヤーの再描画をトリガーする。

## Camera コンポーネントの設定

```tsx
<Mapbox.Camera
  ref={sharedCameraRef}
  defaultSettings={{              // ← centerCoordinate/zoomLevel直指定ではなくdefaultSettings
    centerCoordinate: [139.7671, 35.6812],
    zoomLevel: 12,
  }}
  animationDuration={0}
/>
```

- `defaultSettings` は初回のみ適用（再レンダー時にsetCameraを上書きしない）
- 直接propsで指定すると、内部的にsetCameraが呼ばれ、復元したカメラ位置が上書きされる

## 既知の制限

- **150ms遅延**: Portal teleport完了を検知するAPIがないため、経験的な値に依存
- **初回訪問時のカメラ**: 保存済み状態がないため、`user-map-view.tsx` の初回フィットに依存
- **高速切り替え時の遅延感**: opacityマスクで隠すが、150ms + 150ms fade-in の合計300msは体感される
