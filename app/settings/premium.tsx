/**
 * プレミアムプラン購入ページ
 */

import { useRouter } from 'expo-router';
import { PaywallPage } from '@/pages/paywall';

export default function PremiumScreen() {
  const router = useRouter();

  const handleSuccess = () => {
    router.back();
  };

  return <PaywallPage onPurchaseSuccess={handleSuccess} />;
}
