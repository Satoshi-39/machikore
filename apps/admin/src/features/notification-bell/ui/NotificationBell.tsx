"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  AlertTriangle,
  MonitorCog,
  MessageSquare,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { formatRelativeTime } from "@/shared/lib";
import {
  getNotifications,
  getUnreadNotificationCount,
} from "@/entities/notification";
import type { AdminNotification } from "@/entities/notification";
import { markAsRead, markAllAsRead } from "../api/actions";

const TYPE_ICON: Record<
  AdminNotification["type"],
  React.ComponentType<{ className?: string }>
> = {
  report: AlertTriangle,
  system: MonitorCog,
  inquiry: MessageSquare,
};

const TYPE_COLOR: Record<AdminNotification["type"], string> = {
  report: "text-red-500",
  system: "text-blue-500",
  inquiry: "text-green-500",
};

function getNotificationHref(notification: AdminNotification): string | null {
  const meta = notification.metadata;
  if (notification.type === "report" && meta?.report_id) {
    return `/reports/${meta.report_id}`;
  }
  return null;
}

export function NotificationBell() {
  const router = useRouter();
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);

  const fetchData = useCallback(async () => {
    const [items, count] = await Promise.all([
      getNotifications(10),
      getUnreadNotificationCount(),
    ]);
    setNotifications(items);
    setUnreadCount(count);
  }, []);

  // ページ遷移時にデータを再取得
  useEffect(() => {
    fetchData();
  }, [pathname, fetchData]);

  const handleNotificationClick = async (notification: AdminNotification) => {
    if (!notification.is_read) {
      // 楽観的更新
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      await markAsRead(notification.id);
    }

    const href = getNotificationHref(notification);
    if (href) {
      setOpen(false);
      router.push(href);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadIds = notifications
      .filter((n) => !n.is_read)
      .map((n) => n.id);

    if (unreadIds.length === 0) return;

    // 楽観的更新
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    await markAllAsRead(unreadIds);
  };

  const hasUnread = unreadCount > 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align="end" forceMount>
        <DropdownMenuLabel className="flex items-center justify-between font-normal">
          <span className="text-sm font-semibold">通知</span>
          {hasUnread && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              すべて既読
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 ? (
          <div className="px-3 py-6 text-center text-sm text-muted-foreground">
            通知はありません
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = TYPE_ICON[notification.type];
            const iconColor = TYPE_COLOR[notification.type];
            const href = getNotificationHref(notification);

            return (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 px-3 py-2.5 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${iconColor}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-sm truncate ${
                        notification.is_read ? "font-normal" : "font-semibold"
                      }`}
                    >
                      {notification.title}
                    </span>
                  </div>
                  {notification.body && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {notification.body}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(notification.created_at)}
                    {href && " · 詳細を見る"}
                  </p>
                </div>
                {!notification.is_read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                )}
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
