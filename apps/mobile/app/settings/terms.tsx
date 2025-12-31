/**
 * 利用規約ページ
 */

import { useRouter } from 'expo-router';
import { LegalDocumentPage } from '@/pages/settings';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <LegalDocumentPage
      type="terms_of_service"
      onBack={() => router.back()}
    />
  );
}
