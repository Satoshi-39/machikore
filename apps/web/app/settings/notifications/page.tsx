import { ShareLandingPage } from "@/shared/ui";

export default function NotificationSettingsPage() {
  return (
    <ShareLandingPage
      title="通知設定"
      description="アプリで通知設定を変更できます"
      imageUrl={null}
      deepLink="machikore://settings/notifications"
    />
  );
}
