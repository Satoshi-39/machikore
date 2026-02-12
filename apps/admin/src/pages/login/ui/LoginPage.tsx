import { LoginForm } from "@/features/auth-login";

export function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-surface rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-on-surface">
            街コレ 管理画面
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">
            管理者アカウントでログインしてください
          </p>
        </div>

        <LoginForm />
      </div>

      <p className="text-center text-xs text-on-surface-variant mt-4">
        管理者権限を持つアカウントのみアクセスできます
      </p>
    </div>
  );
}
