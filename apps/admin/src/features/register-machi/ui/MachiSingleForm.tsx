"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { PLACE_TYPE_LABELS } from "@/shared/config";

type PrefectureOption = {
  id: string;
  name: string;
};

type CityOption = {
  id: string;
  name: string;
};

const placeTypes = Object.entries(PLACE_TYPE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export function MachiSingleForm() {
  const [name, setName] = useState("");
  const [nameKana, setNameKana] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedPrefectureId, setSelectedPrefectureId] = useState<string>("");
  const [selectedCityId, setSelectedCityId] = useState<string>("");
  const [placeType, setPlaceType] = useState<string>("neighbourhood");

  const [prefectures, setPrefectures] = useState<PrefectureOption[]>([]);
  const [cities, setCities] = useState<CityOption[]>([]);
  const [isLoadingPrefectures, setIsLoadingPrefectures] = useState(false);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // 都道府県一覧を取得
  useEffect(() => {
    const loadPrefectures = async () => {
      setIsLoadingPrefectures(true);
      try {
        const response = await fetch("/api/prefectures");
        if (response.ok) {
          const data = await response.json();
          setPrefectures(data);
        }
      } catch (error) {
        console.error("Failed to load prefectures:", error);
      } finally {
        setIsLoadingPrefectures(false);
      }
    };
    loadPrefectures();
  }, []);

  // 都道府県が選択されたら市区町村を取得
  useEffect(() => {
    if (!selectedPrefectureId) {
      setCities([]);
      return;
    }

    const loadCities = async () => {
      setIsLoadingCities(true);
      setSelectedCityId("");
      try {
        const response = await fetch(`/api/cities?prefecture_id=${selectedPrefectureId}`);
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (error) {
        console.error("Failed to load cities:", error);
      } finally {
        setIsLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedPrefectureId]);

  // 街登録
  const handleRegister = async () => {
    if (!name.trim() || !selectedPrefectureId) return;
    setIsRegistering(true);
    setRegistrationResult(null);

    try {
      const response = await fetch("/api/machi/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          name_kana: nameKana.trim() || null,
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          prefecture_id: selectedPrefectureId,
          city_id: selectedCityId || null,
          place_type: placeType,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setRegistrationResult({ success: true, message: `街「${name}」を登録しました` });
        // フォームをリセット
        setName("");
        setNameKana("");
        setLatitude("");
        setLongitude("");
        setSelectedCityId("");
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
        街データを個別に登録します
      </p>

      <div className="mt-6 space-y-6">
        {/* 街名 */}
        <div className="space-y-2">
          <Label>街名 *</Label>
          <Input
            placeholder="例: 渋谷"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* 読み仮名 */}
        <div className="space-y-2">
          <Label>読み仮名</Label>
          <Input
            placeholder="例: しぶや"
            value={nameKana}
            onChange={(e) => setNameKana(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* 都道府県 */}
        <div className="space-y-2">
          <Label>都道府県 *</Label>
          <Select value={selectedPrefectureId} onValueChange={setSelectedPrefectureId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="都道府県を選択..." />
            </SelectTrigger>
            <SelectContent>
              {isLoadingPrefectures ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                prefectures.map((pref) => (
                  <SelectItem key={pref.id} value={pref.id}>
                    {pref.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 市区町村 */}
        <div className="space-y-2">
          <Label>市区町村</Label>
          <Select
            value={selectedCityId}
            onValueChange={setSelectedCityId}
            disabled={!selectedPrefectureId}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder={selectedPrefectureId ? "市区町村を選択..." : "先に都道府県を選択"} />
            </SelectTrigger>
            <SelectContent>
              {isLoadingCities ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                cities.map((city) => (
                  <SelectItem key={city.id} value={city.id}>
                    {city.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 種別 */}
        <div className="space-y-2">
          <Label>種別</Label>
          <Select value={placeType} onValueChange={setPlaceType}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {placeTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 座標 */}
        <div className="space-y-2">
          <Label>座標</Label>
          <div className="flex gap-4 max-w-md">
            <div className="flex-1">
              <Input
                type="number"
                step="any"
                placeholder="緯度（例: 35.6595）"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                step="any"
                placeholder="経度（例: 139.7004）"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
            </div>
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
          disabled={!name.trim() || !selectedPrefectureId || isRegistering}
          className="w-full max-w-md"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登録中...
            </>
          ) : (
            "街を登録"
          )}
        </Button>
      </div>
    </div>
  );
}
