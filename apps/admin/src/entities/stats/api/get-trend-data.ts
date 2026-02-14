import { createServerClient } from "@/shared/api";

export type TrendPoint = {
  date: string; // "MM/DD" 形式
  users: number;
  spots: number;
  maps: number;
};

/**
 * 過去30日間の日別登録数を取得
 */
export async function getTrendData(): Promise<TrendPoint[]> {
  const supabase = await createServerClient();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
  const since = thirtyDaysAgo.toISOString();

  const [usersResult, spotsResult, mapsResult] = await Promise.all([
    supabase
      .from("users")
      .select("created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true }),
    supabase
      .from("user_spots")
      .select("created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true }),
    supabase
      .from("maps")
      .select("created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true }),
  ]);

  // 過去30日分の日付マップを初期化
  const dateMap = new Map<string, TrendPoint>();
  for (let i = 0; i < 30; i++) {
    const d = new Date();
    d.setDate(d.getDate() - 29 + i);
    const key = d.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const label = `${d.getMonth() + 1}/${d.getDate()}`; // "M/D"
    dateMap.set(key, { date: label, users: 0, spots: 0, maps: 0 });
  }

  // カウント集計
  for (const row of usersResult.data ?? []) {
    const key = row.created_at.slice(0, 10);
    const point = dateMap.get(key);
    if (point) point.users++;
  }
  for (const row of spotsResult.data ?? []) {
    const key = row.created_at.slice(0, 10);
    const point = dateMap.get(key);
    if (point) point.spots++;
  }
  for (const row of mapsResult.data ?? []) {
    const key = row.created_at.slice(0, 10);
    const point = dateMap.get(key);
    if (point) point.maps++;
  }

  return Array.from(dateMap.values());
}
