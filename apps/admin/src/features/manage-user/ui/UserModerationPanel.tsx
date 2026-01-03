"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Ban, RotateCcw, Trash2, RefreshCw } from "lucide-react";
import {
  suspendUser,
  unsuspendUser,
  deleteUser,
  restoreUser,
} from "../api/actions";

type UserModerationPanelProps = {
  userId: string;
  userStatus: string;
  displayName: string;
};

export function UserModerationPanel({
  userId,
  userStatus,
  displayName,
}: UserModerationPanelProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [unsuspendDialogOpen, setUnsuspendDialogOpen] = useState(false);
  const [suspendReason, setSuspendReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSuspend = async () => {
    if (!suspendReason.trim()) {
      setError("停止理由を入力してください");
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await suspendUser(userId, suspendReason);

    if (result.success) {
      setSuspendDialogOpen(false);
      setSuspendReason("");
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  const handleUnsuspend = async () => {
    setIsLoading(true);
    setError(null);

    const result = await unsuspendUser(userId);

    if (result.success) {
      setUnsuspendDialogOpen(false);
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const result = await deleteUser(userId);

    if (result.success) {
      setDeleteDialogOpen(false);
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setError(null);

    const result = await restoreUser(userId);

    if (result.success) {
      setRestoreDialogOpen(false);
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* 停止ボタン（アクティブユーザーのみ） */}
      {userStatus === "active" && (
        <Dialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-amber-600 border-amber-600 hover:bg-amber-50">
              <Ban className="h-4 w-4 mr-2" />
              停止
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ユーザーを停止</DialogTitle>
              <DialogDescription>
                {displayName} さんのアカウントを停止します。停止されたユーザーはログインできなくなります。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reason">停止理由</Label>
                <Textarea
                  id="reason"
                  placeholder="停止理由を入力してください..."
                  value={suspendReason}
                  onChange={(e) => setSuspendReason(e.target.value)}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSuspendDialogOpen(false)}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={handleSuspend}
                disabled={isLoading}
              >
                {isLoading ? "処理中..." : "停止する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 停止解除ボタン（停止中ユーザーのみ） */}
      {userStatus === "suspended" && (
        <Dialog open={unsuspendDialogOpen} onOpenChange={setUnsuspendDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-green-600 border-green-600 hover:bg-green-50">
              <RotateCcw className="h-4 w-4 mr-2" />
              停止解除
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>停止を解除</DialogTitle>
              <DialogDescription>
                {displayName} さんのアカウント停止を解除します。再びログインできるようになります。
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-sm text-red-600 py-4">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setUnsuspendDialogOpen(false)}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700"
                onClick={handleUnsuspend}
                disabled={isLoading}
              >
                {isLoading ? "処理中..." : "停止を解除する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 削除ボタン（削除済み以外） */}
      {userStatus !== "deleted" && (
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ユーザーを削除</DialogTitle>
              <DialogDescription>
                {displayName} さんのアカウントを削除します。この操作は後から復元できます。
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-sm text-red-600 py-4">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isLoading}
              >
                {isLoading ? "処理中..." : "削除する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* 復元ボタン（削除済みユーザーのみ） */}
      {userStatus === "deleted" && (
        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
              <RefreshCw className="h-4 w-4 mr-2" />
              復元
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>ユーザーを復元</DialogTitle>
              <DialogDescription>
                {displayName} さんのアカウントを復元します。アクティブ状態に戻ります。
              </DialogDescription>
            </DialogHeader>
            {error && <p className="text-sm text-red-600 py-4">{error}</p>}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setRestoreDialogOpen(false)}
                disabled={isLoading}
              >
                キャンセル
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleRestore}
                disabled={isLoading}
              >
                {isLoading ? "処理中..." : "復元する"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
