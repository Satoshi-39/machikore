/**
 * プレミアムプラン購入ページ（モーダル）
 */

import { useRouter } from 'expo-router';
import { PaywallPage } from '@/pages/paywall';

export default function PremiumScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    router.dismiss();
  };

  return <PaywallPage onPurchaseSuccess={handleSuccess} />;
}
