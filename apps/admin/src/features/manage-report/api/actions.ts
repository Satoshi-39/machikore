"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/shared/api";
import type { Database } from "@machikore/database";

type ReportStatus = Database["public"]["Enums"]["report_status"];
type ReportTargetType = Database["public"]["Enums"]["report_target_type"];
type ModerationStatus = Database["public"]["Enums"]["moderation_status"];

export type ActionResult = {
  success: boolean;
  error?: string;
};

/**
 * 通報ステータスを更新する
 */
export async function updateReportStatus(
  reportId: string,
  status: ReportStatus,
  adminNotes?: string
): Promise<ActionResult> {
  const supabase = createAdminClient();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (adminNotes !== undefined) {
    updateData.admin_notes = adminNotes;
  }

  // resolved/dismissed の場合は resolved_at と resolved_by を設定
  if (status === "resolved" || status === "dismissed") {
    updateData.resolved_at = new Date().toISOString();
    // admin clientなので resolved_by にはセッション情報がない。nullのまま。
  }

  const { error } = await supabase
    .from("reports")
    .update(updateData)
    .eq("id", reportId);

  if (error) {
    console.error("Failed to update report status:", error);
    return { success: false, error: "通報ステータスの更新に失敗しました" };
  }

  revalidatePath(`/reports/${reportId}`);
  revalidatePath("/reports");
  return { success: true };
}

/**
 * コンテンツのモデレーションステータスを更新する
 */
export async function moderateContent(
  targetType: ReportTargetType,
  targetId: string,
  moderationStatus: ModerationStatus
): Promise<ActionResult> {
  const supabase = createAdminClient();

  let tableName: "maps" | "user_spots" | "comments";

  switch (targetType) {
    case "map":
      tableName = "maps";
      break;
    case "spot":
      tableName = "user_spots";
      break;
    case "comment":
      tableName = "comments";
      break;
    case "user":
      return { success: false, error: "ユーザーのモデレーションはユーザー管理から行ってください" };
    default:
      return { success: false, error: "不明な対象タイプです" };
  }

  const { error } = await supabase
    .from(tableName)
    .update({ moderation_status: moderationStatus })
    .eq("id", targetId);

  if (error) {
    console.error("Failed to moderate content:", error);
    return { success: false, error: "コンテンツのモデレーションに失敗しました" };
  }

  revalidatePath("/reports");
  return { success: true };
}
