import { createAdminClient } from "@/shared/api";
import { getPaginationRange, buildPaginatedResult } from "@/shared/lib";
import type { PaginatedResult } from "@/shared/types";
import type { Report, GetReportsParams } from "../model/types";

export async function getReports(params: GetReportsParams = {}): Promise<PaginatedResult<Report>> {
  const { status, targetType } = params;
  const { from, to, page, perPage } = getPaginationRange(params.page, params.perPage);
  const supabase = createAdminClient();

  let query = supabase
    .from("reports_with_target")
    .select(
      "id, reason, description, status, target_type, target_id, target_name, created_at, reporter_id, reporter_username, reporter_display_name",
      { count: "exact" }
    );

  if (status && status.length > 0) {
    query = query.in("status", status);
  }

  if (targetType && targetType.length > 0) {
    query = query.in("target_type", targetType);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch reports:", error);
    return buildPaginatedResult([], 0, page, perPage);
  }

  const reports: Report[] = (data ?? []).map((row) => ({
    id: row.id!,
    reason: row.reason!,
    description: row.description,
    status: row.status!,
    target_type: row.target_type!,
    target_id: row.target_id!,
    target_name: row.target_name,
    created_at: row.created_at!,
    reporter: row.reporter_id
      ? {
          id: row.reporter_id,
          username: row.reporter_username!,
          display_name: row.reporter_display_name,
        }
      : null,
  }));

  return buildPaginatedResult(reports, count, page, perPage);
}
