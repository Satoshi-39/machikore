/**
 * プライバシーポリシーページ
 */

import { useRouter } from 'expo-router';
import { LegalDocumentPage } from '@/pages/settings';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <LegalDocumentPage
      type="privacy_policy"
      onBack={() => router.back()}
    />
  );
}
