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
import {
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Trash2,
  RotateCcw,
} from "lucide-react";
import { updateReportStatus, moderateContent } from "../api/actions";
import { MODERATION_STATUS_LABELS } from "@/shared/config";
import type { Database } from "@machikore/database";

type ReportStatus = Database["public"]["Enums"]["report_status"];
type ReportTargetType = Database["public"]["Enums"]["report_target_type"];
type ModerationStatus = Database["public"]["Enums"]["moderation_status"];

type ReportModerationPanelProps = {
  reportId: string;
  reportStatus: ReportStatus;
  adminNotes: string | null;
  targetType: ReportTargetType;
  targetId: string;
  currentModerationStatus?: ModerationStatus;
};

export function ReportModerationPanel({
  reportId,
  reportStatus,
  adminNotes: initialAdminNotes,
  targetType,
  targetId,
  currentModerationStatus,
}: ReportModerationPanelProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState(initialAdminNotes ?? "");
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [dismissDialogOpen, setDismissDialogOpen] = useState(false);
  const [moderateDialogOpen, setModerateDialogOpen] = useState(false);
  const [selectedModerationStatus, setSelectedModerationStatus] =
    useState<ModerationStatus>("hidden");

  const handleStatusUpdate = async (status: ReportStatus) => {
    setIsLoading(true);
    setError(null);

    const result = await updateReportStatus(reportId, status, adminNotes);

    if (result.success) {
      setResolveDialogOpen(false);
      setDismissDialogOpen(false);
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  const handleReviewing = async () => {
    setIsLoading(true);
    setError(null);

    const result = await updateReportStatus(reportId, "reviewing", adminNotes);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  const handleSaveNotes = async () => {
    setIsLoading(true);
    setError(null);

    const result = await updateReportStatus(reportId, reportStatus, adminNotes);

    if (result.success) {
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  const handleModerateContent = async () => {
    setIsLoading(true);
    setError(null);

    const result = await moderateContent(
      targetType,
      targetId,
      selectedModerationStatus
    );

    if (result.success) {
      setModerateDialogOpen(false);
      router.refresh();
    } else {
      setError(result.error || "エラーが発生しました");
    }

    setIsLoading(false);
  };

  const isResolved = reportStatus === "resolved" || reportStatus === "dismissed";

  return (
    <div className="space-y-6">
      {/* ステータス変更 */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          ステータス変更
        </h3>
        <div className="flex flex-wrap gap-2">
          {/* 確認中にする */}
          {reportStatus === "pending" && (
            <Button
              variant="outline"
              className="text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={handleReviewing}
              disabled={isLoading}
            >
              <Eye className="h-4 w-4 mr-2" />
              確認中にする
            </Button>
          )}

          {/* 解決済みにする */}
          {!isResolved && (
            <Dialog
              open={resolveDialogOpen}
              onOpenChange={setResolveDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-green-600 border-green-600 hover:bg-green-50"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  解決済みにする
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>通報を解決済みにする</DialogTitle>
                  <DialogDescription>
                    この通報を解決済みとしてマークします。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="resolve-notes">管理者メモ</Label>
                    <Textarea
                      id="resolve-notes"
                      placeholder="対応内容を記録..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setResolveDialogOpen(false)}
                    disabled={isLoading}
                  >
                    キャンセル
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleStatusUpdate("resolved")}
                    disabled={isLoading}
                  >
                    {isLoading ? "処理中..." : "解決済みにする"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* 却下する */}
          {!isResolved && (
            <Dialog
              open={dismissDialogOpen}
              onOpenChange={setDismissDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="text-gray-600 border-gray-400 hover:bg-gray-50"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  却下する
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>通報を却下する</DialogTitle>
                  <DialogDescription>
                    この通報を却下します。対応不要と判断した場合に使用します。
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="dismiss-notes">却下理由</Label>
                    <Textarea
                      id="dismiss-notes"
                      placeholder="却下理由を記録..."
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                    />
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setDismissDialogOpen(false)}
                    disabled={isLoading}
                  >
                    キャンセル
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleStatusUpdate("dismissed")}
                    disabled={isLoading}
                  >
                    {isLoading ? "処理中..." : "却下する"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* 管理者メモ */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">管理者メモ</h3>
        <div className="space-y-2">
          <Textarea
            placeholder="管理者メモを入力..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            disabled={isLoading}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveNotes}
            disabled={isLoading || adminNotes === (initialAdminNotes ?? "")}
          >
            {isLoading ? "保存中..." : "メモを保存"}
          </Button>
        </div>
      </div>

      {/* コンテンツモデレーション（user以外） */}
      {targetType !== "user" && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            コンテンツモデレーション
          </h3>
          {currentModerationStatus && (
            <p className="text-sm text-gray-500 mb-2">
              現在のステータス:{" "}
              <span className="font-medium">
                {MODERATION_STATUS_LABELS[currentModerationStatus] ??
                  currentModerationStatus}
              </span>
            </p>
          )}
          <Dialog
            open={moderateDialogOpen}
            onOpenChange={setModerateDialogOpen}
          >
            <DialogTrigger asChild>
              <div className="flex flex-wrap gap-2">
                {currentModerationStatus !== "hidden" && (
                  <Button
                    variant="outline"
                    className="text-amber-600 border-amber-600 hover:bg-amber-50"
                    onClick={() => {
                      setSelectedModerationStatus("hidden");
                      setModerateDialogOpen(true);
                    }}
                  >
                    <EyeOff className="h-4 w-4 mr-2" />
                    非表示にする
                  </Button>
                )}
                {currentModerationStatus !== "removed" && (
                  <Button
                    variant="outline"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => {
                      setSelectedModerationStatus("removed");
                      setModerateDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    削除する
                  </Button>
                )}
                {currentModerationStatus !== "normal" && (
                  <Button
                    variant="outline"
                    className="text-green-600 border-green-600 hover:bg-green-50"
                    onClick={() => {
                      setSelectedModerationStatus("normal");
                      setModerateDialogOpen(true);
                    }}
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    復元する
                  </Button>
                )}
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>コンテンツモデレーション</DialogTitle>
                <DialogDescription>
                  コンテンツのモデレーションステータスを「
                  {MODERATION_STATUS_LABELS[selectedModerationStatus]}
                  」に変更します。
                </DialogDescription>
              </DialogHeader>
              {error && <p className="text-sm text-red-600 py-4">{error}</p>}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setModerateDialogOpen(false)}
                  disabled={isLoading}
                >
                  キャンセル
                </Button>
                <Button
                  variant={
                    selectedModerationStatus === "normal"
                      ? "default"
                      : "destructive"
                  }
                  onClick={handleModerateContent}
                  disabled={isLoading}
                >
                  {isLoading ? "処理中..." : "変更する"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* エラー表示 */}
      {error && !resolveDialogOpen && !dismissDialogOpen && !moderateDialogOpen && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
