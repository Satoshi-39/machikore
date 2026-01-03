"use client";

import { useState, useCallback } from "react";
import { Upload, FileSpreadsheet, Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";

type CsvRow = {
  row_number: number;
  name: string;
  name_kana?: string;
  latitude?: number;
  longitude?: number;
  prefecture_id: string;
  city_id?: string;
  place_type?: string;
  status: "pending" | "processing" | "success" | "error";
  error?: string;
  machi_id?: string;
};

type ImportProgress = {
  total: number;
  completed: number;
  success: number;
  failed: number;
};

export function MachiBulkUpload() {
  const [csvRows, setCsvRows] = useState<CsvRow[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // CSVファイルをパース
  const parseCSV = (content: string): CsvRow[] => {
    const lines = content.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());

    const nameIndex = headers.findIndex((h) => h === "name" || h === "街名");
    const nameKanaIndex = headers.findIndex((h) => h === "name_kana" || h === "読み仮名");
    const latIndex = headers.findIndex((h) => h === "latitude" || h === "緯度");
    const lngIndex = headers.findIndex((h) => h === "longitude" || h === "経度");
    const prefectureIndex = headers.findIndex((h) => h === "prefecture_id" || h === "都道府県id");
    const cityIndex = headers.findIndex((h) => h === "city_id" || h === "市区町村id");
    const placeTypeIndex = headers.findIndex((h) => h === "place_type" || h === "種別");

    if (nameIndex === -1 || prefectureIndex === -1) {
      throw new Error("CSVにname列とprefecture_id列が必要です");
    }

    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
      const name = values[nameIndex];
      const prefectureId = values[prefectureIndex];
      if (!name || !prefectureId) continue;

      rows.push({
        row_number: i + 1,
        name,
        name_kana: nameKanaIndex !== -1 ? values[nameKanaIndex] : undefined,
        latitude: latIndex !== -1 && values[latIndex] ? parseFloat(values[latIndex]) : undefined,
        longitude: lngIndex !== -1 && values[lngIndex] ? parseFloat(values[lngIndex]) : undefined,
        prefecture_id: prefectureId,
        city_id: cityIndex !== -1 ? values[cityIndex] : undefined,
        place_type: placeTypeIndex !== -1 ? values[placeTypeIndex] : "neighbourhood",
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
    if (csvRows.length === 0) return;

    setIsImporting(true);
    setProgress({ total: csvRows.length, completed: 0, success: 0, failed: 0 });

    const updatedRows = [...csvRows];
    let successCount = 0;
    let failedCount = 0;

    // バッチ処理（10件ずつ）
    const batchSize = 10;
    for (let i = 0; i < csvRows.length; i += batchSize) {
      const batch = csvRows.slice(i, i + batchSize);

      await Promise.all(
        batch.map(async (row, batchIndex) => {
          const index = i + batchIndex;
          updatedRows[index] = { ...updatedRows[index], status: "processing" };
          setCsvRows([...updatedRows]);

          try {
            const response = await fetch("/api/machi/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: row.name,
                name_kana: row.name_kana || null,
                latitude: row.latitude ?? null,
                longitude: row.longitude ?? null,
                prefecture_id: row.prefecture_id,
                city_id: row.city_id || null,
                place_type: row.place_type || "neighbourhood",
              }),
            });

            const data = await response.json();
            if (response.ok) {
              updatedRows[index] = {
                ...updatedRows[index],
                status: "success",
                machi_id: data.id,
              };
              successCount++;
            } else {
              updatedRows[index] = {
                ...updatedRows[index],
                status: "error",
                error: data.error || "登録失敗",
              };
              failedCount++;
            }
          } catch {
            updatedRows[index] = {
              ...updatedRows[index],
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
        })
      );
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
        CSVファイルから複数の街を一括で登録します
      </p>

      <div className="mt-6 space-y-6">
        {/* CSVフォーマット説明 */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-medium text-blue-900">CSVフォーマット</h3>
              <p className="mt-1 text-sm text-blue-700">
                1行目にヘッダー、2行目以降にデータを記述してください
              </p>
              <code className="mt-2 block rounded bg-blue-100 p-2 text-xs text-blue-800 overflow-x-auto">
                name,name_kana,latitude,longitude,prefecture_id,city_id,place_type
                <br />
                渋谷,しぶや,35.6595,139.7004,tokyo,tokyo_shibuya,neighbourhood
                <br />
                新宿,しんじゅく,35.6938,139.7034,tokyo,tokyo_shinjuku,neighbourhood
              </code>
              <p className="mt-2 text-xs text-blue-600">
                ※ name, prefecture_id は必須。その他は省略可
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
                    <TableHead>街名</TableHead>
                    <TableHead>都道府県ID</TableHead>
                    <TableHead>市区町村ID</TableHead>
                    <TableHead>結果</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvRows.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{getStatusIcon(row.status)}</TableCell>
                      <TableCell className="text-gray-500">{row.row_number}</TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-gray-500">{row.prefecture_id}</TableCell>
                      <TableCell className="text-gray-500">{row.city_id || "-"}</TableCell>
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
              disabled={isImporting}
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
