"use client";

import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, XCircle, AlertCircle, Search, Check } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type UserOption = {
  id: string;
  display_name: string;
  username: string;
};

type CsvRow = {
  row_number: number;
  name: string;
  description?: string;
  category_id?: string;
  is_public?: boolean;
  is_official?: boolean;
  language?: string;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
  map_id?: string;
};

type ImportProgress = {
  total: number;
  completed: number;
  success: number;
  failed: number;
};

export function MapBulkUpload() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [users, setUsers] = useState<UserOption[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearch, setUserSearch] = useState("");

  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  // CSVファイルをパース
  const parseCSV = (content: string): CsvRow[] => {
    const lines = content.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const nameIndex = headers.findIndex((h) => h === "name" || h === "マップ名");
    const descIndex = headers.findIndex((h) => h === "description" || h === "説明");
    const categoryIndex = headers.findIndex((h) => h === "category_id" || h === "カテゴリ");
    const publicIndex = headers.findIndex((h) => h === "is_public" || h === "公開");
    const officialIndex = headers.findIndex((h) => h === "is_official" || h === "公式");
    const languageIndex = headers.findIndex((h) => h === "language" || h === "言語");

    if (nameIndex === -1) {
      throw new Error("CSVにname列が見つかりません");
    }

    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const name = values[nameIndex];
      if (!name) continue;

      rows.push({
        row_number: i + 1,
        name,
        description: descIndex !== -1 ? values[descIndex] : undefined,
        category_id: categoryIndex !== -1 ? values[categoryIndex] : undefined,
        is_public: publicIndex !== -1 ? values[publicIndex] === "true" || values[publicIndex] === "1" : false,
        is_official: officialIndex !== -1 ? values[officialIndex] === "true" || values[officialIndex] === "1" : true,
        language: languageIndex !== -1 ? values[languageIndex] : "ja",
        status: "pending",
      });
    }

    return rows;
  };

  // ファイルドロップ処理
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || (!file.name.toLowerCase().endsWith(".csv") && file.type !== "text/csv")) {
      alert("CSVファイルをアップロードしてください");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const rows = parseCSV(content);
        setCsvRows(rows);
        setProgress(null);
      } catch (error) {
        alert(error instanceof Error ? error.message : "CSVの読み込みに失敗しました");
      }
    };
    reader.readAsText(file);
  }, []);

  // ファイル選択処理
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const rows = parseCSV(content);
        setCsvRows(rows);
        setProgress(null);
      } catch (error) {
        alert(error instanceof Error ? error.message : "CSVの読み込みに失敗しました");
      }
    };
    reader.readAsText(file);
  };

  // 一括登録実行
  const handleImport = async () => {
    if (!selectedUserId || csvRows.length === 0) return;

    setIsImporting(true);
    setProgress({ total: csvRows.length, completed: 0, success: 0, failed: 0 });

    const updatedRows = [...csvRows];
    let successCount = 0;
    let failedCount = 0;

    for (let i = 0; i < csvRows.length; i++) {
      const row = csvRows[i];
      updatedRows[i] = { ...updatedRows[i], status: "processing" };
      setCsvRows([...updatedRows]);

      try {
        const response = await fetch("/api/maps/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            description: row.description || null,
            user_id: selectedUserId,
            category_id: row.category_id || null,
            is_public: row.is_public ?? false,
            is_official: row.is_official ?? true,
            language: row.language || "ja",
          }),
        });

        const data = await response.json();
        if (response.ok) {
          updatedRows[i] = {
            ...updatedRows[i],
            status: "success",
            map_id: data.id,
          };
          successCount++;
        } else {
          updatedRows[i] = {
            ...updatedRows[i],
            status: "error",
            error: data.error || "登録失敗",
          };
          failedCount++;
        }
      } catch {
        updatedRows[i] = {
          ...updatedRows[i],
          status: "error",
          error: "通信エラー",
        };
        failedCount++;
      }

      setCsvRows([...updatedRows]);
      setProgress({
        total: csvRows.length,
        completed: successCount + failedCount,
        success: successCount,
        failed: failedCount,
      });
    }

    setIsImporting(false);
  };

  const getStatusIcon = (status: CsvRow["status"]) => {
    switch (status) {
      case "pending":
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">一括登録 (CSV)</h2>
      <p className="mt-1 text-sm text-gray-600">
        CSVファイルから複数のマップを一括で登録します
      </p>

      <div className="mt-6 space-y-6">
        {/* オーナー選択 */}
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
            <div className="mt-2 max-h-40 overflow-y-auto rounded-lg border max-w-md">
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

        {/* CSVフォーマット説明 */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">CSVフォーマット</h3>
              <p className="mt-1 text-sm text-blue-700">
                1行目にヘッダー、2行目以降にデータを記述してください
              </p>
              <code className="mt-2 block rounded bg-blue-100 p-2 text-xs text-blue-800">
                name,description,category_id,is_public,is_official,language
                <br />
                東京カフェ巡り,都内のおすすめカフェ,gourmet,true,true,ja
                <br />
                京都の神社仏閣,,travel,true,true,ja
              </code>
              <p className="mt-2 text-xs text-blue-600">
                ※ name以外は省略可。is_public/is_officialはtrue/false
              </p>
            </div>
          </div>
        </div>

        {/* ファイルアップロード */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            CSVファイルをドラッグ&ドロップ、またはクリックして選択
          </p>
        </div>

        {/* プレビュー */}
        {csvRows.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                プレビュー ({csvRows.length}件)
              </h3>
              {progress && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-green-600">成功: {progress.success}</span>
                  <span className="text-red-600">失敗: {progress.failed}</span>
                  <span className="text-gray-500">
                    {progress.completed} / {progress.total}
                  </span>
                </div>
              )}
            </div>

            <div className="max-h-96 overflow-auto rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">状態</TableHead>
                    <TableHead className="w-16">行</TableHead>
                    <TableHead>マップ名</TableHead>
                    <TableHead>カテゴリ</TableHead>
                    <TableHead>公開</TableHead>
                    <TableHead>結果</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{getStatusIcon(row.status)}</TableCell>
                      <TableCell className="text-gray-500">{row.row_number}</TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-gray-500">{row.category_id || "-"}</TableCell>
                      <TableCell>
                        {row.is_public ? (
                          <span className="text-green-600">公開</span>
                        ) : (
                          <span className="text-gray-400">非公開</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {row.status === "success" && (
                          <span className="text-green-600">登録完了</span>
                        )}
                        {row.status === "error" && (
                          <span className="text-red-600">{row.error}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* インポートボタン */}
            <Button
              onClick={handleImport}
              disabled={!selectedUserId || isImporting}
              className="w-full"
            >
              {isImporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  インポート中... ({progress?.completed || 0}/{progress?.total || 0})
                </>
              ) : (
                <>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  {csvRows.length}件をインポート
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
