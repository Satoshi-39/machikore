import { createAdminClient } from "@/shared/api";
import type { ReportDetail } from "../model/types";

export async function getReportDetail(id: string): Promise<ReportDetail | null> {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("reports")
    .select(
      "*, reporter:users!reports_reporter_id_fkey(id, username, display_name, email, avatar_url), resolver:users!reports_resolved_by_fkey(id, username, display_name)"
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch report detail:", error);
    return null;
  }

  return {
    ...data,
    reporter: data.reporter as ReportDetail["reporter"],
    resolver: data.resolver as ReportDetail["resolver"],
  };
}
