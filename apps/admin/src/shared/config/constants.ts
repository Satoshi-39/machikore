/**
 * 管理者ロール定数
 * DB値は小文字、コード内では大文字定数として使用
 */
export const AdminRole = {
  MODERATOR: "moderator",
  ADMIN: "admin",
  OWNER: "owner",
} as const;

export type AdminRoleType = (typeof AdminRole)[keyof typeof AdminRole];
