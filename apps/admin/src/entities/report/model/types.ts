import type { Database } from "@machikore/database";
import type { PaginationParams } from "@/shared/types";

type ReportRow = Database["public"]["Tables"]["reports"]["Row"];
type ReportReason = Database["public"]["Enums"]["report_reason"];
type ReportStatus = Database["public"]["Enums"]["report_status"];
type ReportTargetType = Database["public"]["Enums"]["report_target_type"];

/** 通報一覧用（reporter情報 + 対象名付き） */
export type Report = {
  id: string;
  reason: ReportReason;
  description: string | null;
  status: ReportStatus;
  target_type: ReportTargetType;
  target_id: string;
  target_name: string | null;
  created_at: string;
  reporter: {
    id: string;
    username: string;
    display_name: string | null;
  } | null;
};

/** 通報詳細用 */
export type ReportDetail = ReportRow & {
  reporter: {
    id: string;
    username: string;
    display_name: string;
    email: string;
    avatar_url: string | null;
  } | null;
  resolver: {
    id: string;
    username: string;
    display_name: string;
  } | null;
};

type ModerationStatus = Database["public"]["Enums"]["moderation_status"];

/** 通報対象コンテンツ */
export type ReportTarget =
  | { type: "map"; data: { id: string; name: string; user_id: string; moderation_status: ModerationStatus } }
  | { type: "spot"; data: { id: string; name: string | null; user_id: string; moderation_status: ModerationStatus } }
  | { type: "user"; data: { id: string; username: string; display_name: string; status: string } }
  | { type: "comment"; data: { id: string; content: string; user_id: string; moderation_status: ModerationStatus } };

/** 通報検索パラメータ */
export type GetReportsParams = PaginationParams & {
  status?: ReportStatus[];
  targetType?: ReportTargetType[];
};
