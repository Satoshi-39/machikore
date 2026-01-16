import { useLocalSearchParams } from 'expo-router';
import { MagazineSectionPage } from '@/pages/magazine-section';

export default function MagazineSectionScreen() {
  const { id, sectionId } = useLocalSearchParams<{ id: string; sectionId: string }>();

  if (!id || !sectionId) return null;

  return <MagazineSectionPage magazineId={id} sectionId={sectionId} />;
}
