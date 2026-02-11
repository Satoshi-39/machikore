import ExpoModulesCore
import MapboxMaps

/// Mapbox MapView のメモリ管理 Expo Module
///
/// @rnmapbox/maps が公開していない以下のAPIをブリッジする:
/// - setTileCacheBudget: インメモリタイルキャッシュの上限設定（LRU削除）
/// - setPrefetchZoomDelta: タイルプリフェッチの範囲設定
/// - reduceMemoryUse: 非必須キャッシュリソースの解放
public class MapMemoryManagerModule: Module {
  public func definition() -> ModuleDefinition {
    Name("MapMemoryManager")

    /// インメモリタイルキャッシュの上限をMB単位で設定
    Function("setTileCacheBudget") { (megabytes: Int) in
      DispatchQueue.main.async {
        for mapView in Self.findAllMapViews() {
          mapView.mapboxMap.setTileCacheBudget(size: .megabytes(megabytes))
        }
      }
    }

    /// タイルプリフェッチのズームデルタを設定
    Function("setPrefetchZoomDelta") { (delta: Int) in
      DispatchQueue.main.async {
        for mapView in Self.findAllMapViews() {
          mapView.mapboxMap.prefetchZoomDelta = UInt8(delta)
        }
      }
    }

    /// 非必須のキャッシュリソースをメモリから解放
    Function("reduceMemoryUse") {
      DispatchQueue.main.async {
        for mapView in Self.findAllMapViews() {
          mapView.mapboxMap.reduceMemoryUse()
        }
      }
    }
  }

  // MARK: - Private

  /// アプリ内の全MapViewインスタンスをビュー階層から検索
  private static func findAllMapViews() -> [MapView] {
    var results: [MapView] = []
    for scene in UIApplication.shared.connectedScenes {
      if let windowScene = scene as? UIWindowScene {
        for window in windowScene.windows {
          findMapViews(in: window, results: &results)
        }
      }
    }
    return results
  }

  /// 再帰的にビュー階層を走査してMapViewを探す
  private static func findMapViews(in view: UIView, results: inout [MapView]) {
    if let mapView = view as? MapView {
      results.append(mapView)
      return // MapViewの子にMapViewはないので打ち切り
    }
    for subview in view.subviews {
      findMapViews(in: subview, results: &results)
    }
  }
}
