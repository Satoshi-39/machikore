import { createAdminClient } from "@/shared/api";

export async function getPendingReportsCount(): Promise<number> {
  const supabase = createAdminClient();

  const { count, error } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  if (error) {
    console.error("Failed to fetch pending reports count:", error);
    return 0;
  }

  return count ?? 0;
}
