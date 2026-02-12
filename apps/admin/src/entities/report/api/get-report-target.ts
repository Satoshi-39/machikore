import { createAdminClient } from "@/shared/api";
import type { Database } from "@machikore/database";
import type { ReportTarget } from "../model/types";

type ReportTargetType = Database["public"]["Enums"]["report_target_type"];

export async function getReportTarget(
  targetType: ReportTargetType,
  targetId: string
): Promise<ReportTarget | null> {
  const supabase = createAdminClient();

  switch (targetType) {
    case "map": {
      const { data, error } = await supabase
        .from("maps")
        .select("id, name, user_id, moderation_status")
        .eq("id", targetId)
        .single();

      if (error || !data) return null;
      return { type: "map", data };
    }

    case "spot": {
      const { data, error } = await supabase
        .from("user_spots")
        .select("id, name, user_id, moderation_status")
        .eq("id", targetId)
        .single();

      if (error || !data) return null;
      return { type: "spot", data };
    }

    case "user": {
      const { data, error } = await supabase
        .from("users")
        .select("id, username, display_name, status")
        .eq("id", targetId)
        .single();

      if (error || !data) return null;
      return { type: "user", data };
    }

    case "comment": {
      const { data, error } = await supabase
        .from("comments")
        .select("id, content, user_id, moderation_status")
        .eq("id", targetId)
        .single();

      if (error || !data) return null;
      return { type: "comment", data };
    }

    default:
      return null;
  }
}
