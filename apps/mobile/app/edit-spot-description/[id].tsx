/**
 * スポット一言編集画面
 *
 * スポットのdescription（一言）を編集
 */

import { useLocalSearchParams } from 'expo-router';
import { EditSpotDescriptionPage } from '@/pages/edit-spot-description';

export default function EditSpotDescriptionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  if (!id) {
    return null;
  }

  return <EditSpotDescriptionPage spotId={id} />;
}
