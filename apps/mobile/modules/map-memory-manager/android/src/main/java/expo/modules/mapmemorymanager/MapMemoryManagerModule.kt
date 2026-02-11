package expo.modules.mapmemorymanager

import android.view.View
import android.view.ViewGroup
import com.mapbox.maps.MapView
import com.mapbox.maps.TileCacheBudget
import com.mapbox.maps.TileCacheBudgetInMegabytes
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class MapMemoryManagerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("MapMemoryManager")

    // インメモリタイルキャッシュの上限をMB単位で設定
    Function("setTileCacheBudget") { megabytes: Int ->
      val activity = appContext.currentActivity ?: return@Function
      activity.runOnUiThread {
        findAllMapViews(activity.window.decorView).forEach { mapView ->
          mapView.mapboxMap.setTileCacheBudget(
            TileCacheBudget.valueOf(TileCacheBudgetInMegabytes(megabytes.toLong()))
          )
        }
      }
    }

    // タイルプリフェッチのズームデルタを設定
    Function("setPrefetchZoomDelta") { delta: Int ->
      val activity = appContext.currentActivity ?: return@Function
      activity.runOnUiThread {
        findAllMapViews(activity.window.decorView).forEach { mapView ->
          mapView.mapboxMap.setPrefetchZoomDelta(delta.toByte())
        }
      }
    }

    // 非必須のキャッシュリソースをメモリから解放
    Function("reduceMemoryUse") {
      val activity = appContext.currentActivity ?: return@Function
      activity.runOnUiThread {
        findAllMapViews(activity.window.decorView).forEach { mapView ->
          mapView.mapboxMap.reduceMemoryUse()
        }
      }
    }
  }

  companion object {
    /** ビュー階層を再帰的に走査してMapViewを探す */
    private fun findAllMapViews(view: View): List<MapView> {
      val results = mutableListOf<MapView>()
      findMapViews(view, results)
      return results
    }

    private fun findMapViews(view: View, results: MutableList<MapView>) {
      if (view is MapView) {
        results.add(view)
        return // MapViewの子にMapViewはないので打ち切り
      }
      if (view is ViewGroup) {
        for (i in 0 until view.childCount) {
          findMapViews(view.getChildAt(i), results)
        }
      }
    }
  }
}
