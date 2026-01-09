/**
 * 帰属表示ページのルーティング
 */

import { useRouter } from 'expo-router';
import { AttributionsPage } from '@/pages/settings';

export default function AttributionsRoute() {
  const router = useRouter();
  return <AttributionsPage onBack={() => router.back()} />;
}
