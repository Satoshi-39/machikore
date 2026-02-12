import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, User, Calendar, Flag, FileText } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { getReportDetail, getReportTarget } from "@/entities/report";
import { ReportModerationPanel } from "@/features/manage-report";
import {
  REPORT_STATUS_LABELS,
  REPORT_REASON_LABELS,
  REPORT_TARGET_TYPE_LABELS,
  MODERATION_STATUS_LABELS,
} from "@/shared/config";

type ReportDetailPageProps = {
  reportId: string;
};

function getStatusBadge(status: string) {
  switch (status) {
    case "pending":
      return <Badge className="bg-amber-500">未対応</Badge>;
    case "reviewing":
      return <Badge className="bg-blue-500">確認中</Badge>;
    case "resolved":
      return <Badge className="bg-green-500">解決済</Badge>;
    case "dismissed":
      return <Badge variant="secondary">却下</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getTargetLink(targetType: string, targetId: string): string | null {
  switch (targetType) {
    case "map":
      return `/maps/${targetId}`;
    case "spot":
      return `/spots/${targetId}`;
    case "user":
      return `/users/${targetId}`;
    default:
      return null;
  }
}

export async function ReportDetailPage({ reportId }: ReportDetailPageProps) {
  const report = await getReportDetail(reportId);

  if (!report) {
    notFound();
  }

  const target = await getReportTarget(report.target_type, report.target_id);

  // コンテンツのモデレーションステータスを取得
  let currentModerationStatus: "normal" | "hidden" | "removed" | undefined;
  if (target && target.type !== "user" && "moderation_status" in target.data) {
    currentModerationStatus = target.data.moderation_status;
  }

  const targetLink = getTargetLink(report.target_type, report.target_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/reports">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">通報詳細</h1>
      </div>

      {/* 通報情報カード */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <Flag className="h-5 w-5 text-red-500" />
          <h2 className="text-lg font-bold">通報情報</h2>
          {getStatusBadge(report.status)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-500">理由</div>
            <p className="mt-1 font-medium">
              {REPORT_REASON_LABELS[report.reason] ?? report.reason}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-500">対象タイプ</div>
            <p className="mt-1 font-medium">
              {REPORT_TARGET_TYPE_LABELS[report.target_type] ??
                report.target_type}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              通報日時
            </div>
            <p className="mt-1 font-medium">{formatDate(report.created_at)}</p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm text-gray-500">ステータス</div>
            <p className="mt-1 font-medium">
              {REPORT_STATUS_LABELS[report.status] ?? report.status}
            </p>
          </div>
        </div>

        {/* 説明 */}
        {report.description && (
          <div className="mt-4">
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-1">
              <FileText className="h-3 w-3" />
              説明
            </div>
            <p className="text-gray-700 bg-gray-50 rounded-lg p-4">
              {report.description}
            </p>
          </div>
        )}

        {/* 解決情報 */}
        {report.resolved_at && (
          <div className="mt-4 rounded-lg bg-green-50 border border-green-200 p-4">
            <h3 className="font-medium text-green-800">解決情報</h3>
            <div className="mt-2 text-sm">
              <div>
                <span className="text-green-600">解決日時:</span>
                <span className="ml-2 text-green-800">
                  {formatDate(report.resolved_at)}
                </span>
              </div>
              {report.resolver && (
                <div className="mt-1">
                  <span className="text-green-600">対応者:</span>
                  <span className="ml-2 text-green-800">
                    @{report.resolver.username}
                  </span>
                </div>
              )}
              {report.admin_notes && (
                <div className="mt-1">
                  <span className="text-green-600">管理者メモ:</span>
                  <span className="ml-2 text-green-800">
                    {report.admin_notes}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 通報者情報 */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center gap-3 mb-4">
          <User className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-bold">通報者</h2>
        </div>

        {report.reporter ? (
          <Link
            href={`/users/${report.reporter.id}`}
            className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2"
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={report.reporter.avatar_url ?? undefined} />
              <AvatarFallback>
                {report.reporter.display_name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium hover:underline">
                {report.reporter.display_name}
              </div>
              <div className="text-sm text-gray-500">
                @{report.reporter.username}
              </div>
              <div className="text-sm text-gray-400">
                {report.reporter.email}
              </div>
            </div>
          </Link>
        ) : (
          <p className="text-gray-400">通報者情報なし</p>
        )}
      </div>

      {/* 通報対象コンテンツ */}
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">通報対象</h2>
          {targetLink && (
            <Link href={targetLink}>
              <Button variant="outline" size="sm">
                詳細ページへ
              </Button>
            </Link>
          )}
        </div>

        {target ? (
          <div className="rounded-lg bg-gray-50 p-4">
            {target.type === "map" && (
              <div>
                <div className="text-sm text-gray-500">マップ</div>
                <p className="font-medium">{target.data.name}</p>
                <p className="text-sm text-gray-500 mt-1">
                  モデレーション:{" "}
                  {MODERATION_STATUS_LABELS[target.data.moderation_status] ??
                    target.data.moderation_status}
                </p>
              </div>
            )}
            {target.type === "spot" && (
              <div>
                <div className="text-sm text-gray-500">スポット</div>
                <p className="font-medium">{target.data.name ?? "名前なし"}</p>
                <p className="text-sm text-gray-500 mt-1">
                  モデレーション:{" "}
                  {MODERATION_STATUS_LABELS[target.data.moderation_status] ??
                    target.data.moderation_status}
                </p>
              </div>
            )}
            {target.type === "user" && (
              <div>
                <div className="text-sm text-gray-500">ユーザー</div>
                <p className="font-medium">{target.data.display_name}</p>
                <p className="text-sm text-gray-500">
                  @{target.data.username}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ステータス: {target.data.status}
                </p>
              </div>
            )}
            {target.type === "comment" && (
              <div>
                <div className="text-sm text-gray-500">コメント</div>
                <p className="font-medium">{target.data.content}</p>
                <p className="text-sm text-gray-500 mt-1">
                  モデレーション:{" "}
                  {MODERATION_STATUS_LABELS[target.data.moderation_status] ??
                    target.data.moderation_status}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-400">対象コンテンツが見つかりません（削除済みの可能性があります）</p>
        )}
      </div>

      {/* モデレーションパネル */}
      <div className="rounded-lg border bg-white p-6">
        <h2 className="text-lg font-bold mb-4">モデレーション操作</h2>
        <ReportModerationPanel
          reportId={report.id}
          reportStatus={report.status}
          adminNotes={report.admin_notes}
          targetType={report.target_type}
          targetId={report.target_id}
          currentModerationStatus={currentModerationStatus}
        />
      </div>
    </div>
  );
}
