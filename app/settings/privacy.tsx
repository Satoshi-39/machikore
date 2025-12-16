/**
 * プライバシーポリシーページ
 */

import { useRouter } from 'expo-router';
import { LegalDocumentPage } from '@/pages/settings';
import { PRIVACY_POLICY } from '@/shared/content';

export default function PrivacyScreen() {
  const router = useRouter();

  return (
    <LegalDocumentPage
      title="プライバシーポリシー"
      content={PRIVACY_POLICY}
      onBack={() => router.back()}
    />
  );
}
