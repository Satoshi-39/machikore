"use server";

import { revalidatePath } from "next/cache";
import { createServerClient } from "@/shared/api";

export type ActionResult = {
  success: boolean;
  error?: string;
};

/**
 * ユーザーを停止する
 */
export async function suspendUser(
  userId: string,
  reason: string
): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("users")
    .update({
      status: "suspended",
      suspended_at: new Date().toISOString(),
      suspended_reason: reason,
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to suspend user:", error);
    return { success: false, error: "ユーザーの停止に失敗しました" };
  }

  revalidatePath(`/users/${userId}`);
  revalidatePath("/users");
  return { success: true };
}

/**
 * ユーザーの停止を解除する
 */
export async function unsuspendUser(userId: string): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("users")
    .update({
      status: "active",
      suspended_at: null,
      suspended_reason: null,
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to unsuspend user:", error);
    return { success: false, error: "ユーザーの停止解除に失敗しました" };
  }

  revalidatePath(`/users/${userId}`);
  revalidatePath("/users");
  return { success: true };
}

/**
 * ユーザーを削除（論理削除）する
 */
export async function deleteUser(userId: string): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("users")
    .update({
      status: "deleted",
      deletion_requested_at: new Date().toISOString(),
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to delete user:", error);
    return { success: false, error: "ユーザーの削除に失敗しました" };
  }

  revalidatePath(`/users/${userId}`);
  revalidatePath("/users");
  return { success: true };
}

/**
 * ユーザーを復元する（削除済みから復活）
 */
export async function restoreUser(userId: string): Promise<ActionResult> {
  const supabase = await createServerClient();

  const { error } = await supabase
    .from("users")
    .update({
      status: "active",
      deletion_requested_at: null,
    })
    .eq("id", userId);

  if (error) {
    console.error("Failed to restore user:", error);
    return { success: false, error: "ユーザーの復元に失敗しました" };
  }

  revalidatePath(`/users/${userId}`);
  revalidatePath("/users");
  return { success: true };
}
