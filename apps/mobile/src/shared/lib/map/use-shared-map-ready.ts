/**
 * 共有MapViewのisMapReady状態を購読するhook
 */

import { useSharedMapStore } from './shared-map-store';

export function useSharedMapReady() {
  return useSharedMapStore((s) => s.isMapReady);
}
