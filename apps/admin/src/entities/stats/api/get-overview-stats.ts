import { createServerClient } from "@/shared/api";
import { getPendingReportsCount } from "@/entities/report";

export type OverviewStats = {
  users: number;
  spots: number;
  machi: number;
  maps: number;
  pendingReports: number;
};

/**
 * ダッシュボード用の概要統計を取得
 */
export async function getOverviewStats(): Promise<OverviewStats> {
  const supabase = await createServerClient();

  const [usersResult, spotsResult, machiResult, mapsResult, pendingReports] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }),
    supabase.from("user_spots").select("*", { count: "exact", head: true }),
    supabase.from("machi").select("*", { count: "exact", head: true }),
    supabase.from("maps").select("*", { count: "exact", head: true }),
    getPendingReportsCount(),
  ]);

  return {
    users: usersResult.count ?? 0,
    spots: spotsResult.count ?? 0,
    machi: machiResult.count ?? 0,
    maps: mapsResult.count ?? 0,
    pendingReports,
  };
}
