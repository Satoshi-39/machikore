/**
 * 利用規約ページ
 */

import { useRouter } from 'expo-router';
import { LegalDocumentPage } from '@/pages/settings';
import { TERMS_OF_SERVICE } from '@/shared/content';

export default function TermsScreen() {
  const router = useRouter();

  return (
    <LegalDocumentPage
      title="利用規約"
      content={TERMS_OF_SERVICE}
      onBack={() => router.back()}
    />
  );
}
