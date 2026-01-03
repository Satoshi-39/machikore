"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, Search } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

type UserOption = {
  id: string;
  display_name: string;
  username: string;
};

type CategoryOption = {
  id: string;
  name: string;
};

export function MapSingleForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isPublic, setIsPublic] = useState(false);
  const [isOfficial, setIsOfficial] = useState(true);
  const [language, setLanguage] = useState("ja");

  const [users, setUsers] = useState<UserOption[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // カテゴリ一覧を取得
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await fetch("/api/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // ユーザー検索
  const searchUsers = async () => {
    if (!userSearch.trim()) return;
    setIsLoadingUsers(true);
    try {
      const response = await fetch(
        `/api/users/search?q=${encodeURIComponent(userSearch)}`
      );
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to search users:", error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // マップ登録
  const handleRegister = async () => {
    if (!name.trim() || !selectedUserId) return;
    setIsRegistering(true);
    setRegistrationResult(null);

    try {
      const response = await fetch("/api/maps/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          user_id: selectedUserId,
          category_id: selectedCategoryId || null,
          is_public: isPublic,
          is_official: isOfficial,
          language,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setRegistrationResult({ success: true, message: `マップ「${name}」を登録しました` });
        // フォームをリセット
        setName("");
        setDescription("");
        setSelectedCategoryId("");
        setIsPublic(false);
      } else {
        setRegistrationResult({ success: false, message: data.error || "登録に失敗しました" });
      }
    } catch {
      setRegistrationResult({ success: false, message: "登録に失敗しました" });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">個別登録</h2>
      <p className="mt-1 text-sm text-gray-600">
        公式マップを個別に登録します
      </p>

      <div className="mt-6 space-y-6">
        {/* マップ名 */}
        <div className="space-y-2">
          <Label>マップ名 *</Label>
          <Input
            placeholder="例: 東京のおすすめカフェ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* 説明 */}
        <div className="space-y-2">
          <Label>説明</Label>
          <Textarea
            placeholder="マップの説明..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="max-w-md"
            rows={3}
          />
        </div>

        {/* オーナー（ユーザー） */}
        <div className="space-y-2">
          <Label>マップオーナー *</Label>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="ユーザー名で検索..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchUsers()}
            />
            <Button onClick={searchUsers} disabled={isLoadingUsers || !userSearch.trim()}>
              {isLoadingUsers ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          {users.length > 0 && (
            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`flex w-full items-center justify-between border-b p-2 text-left text-sm last:border-b-0 hover:bg-gray-50 ${
                    selectedUserId === user.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium">{user.display_name}</div>
                    <div className="text-gray-500">@{user.username}</div>
                  </div>
                  {selectedUserId === user.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          )}
          {selectedUserId && (
            <p className="text-sm text-green-600">
              選択中: {users.find((u) => u.id === selectedUserId)?.display_name}
            </p>
          )}
        </div>

        {/* カテゴリ */}
        <div className="space-y-2">
          <Label>カテゴリ</Label>
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="カテゴリを選択..." />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCategories ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 言語 */}
        <div className="space-y-2">
          <Label>言語</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ja">日本語</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh">中文</SelectItem>
              <SelectItem value="ko">한국어</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 公開設定 */}
        <div className="space-y-3">
          <Label>公開設定</Label>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">公開マップにする</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isOfficial}
                onChange={(e) => setIsOfficial(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <span className="text-sm">公式マップにする</span>
            </label>
          </div>
        </div>

        {/* 登録結果 */}
        {registrationResult && (
          <div
            className={`rounded-lg p-4 ${
              registrationResult.success
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {registrationResult.message}
          </div>
        )}

        {/* 登録ボタン */}
        <Button
          onClick={handleRegister}
          disabled={!name.trim() || !selectedUserId || isRegistering}
          className="w-full max-w-md"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登録中...
            </>
          ) : (
            "マップを登録"
          )}
        </Button>
      </div>
    </div>
  );
}
