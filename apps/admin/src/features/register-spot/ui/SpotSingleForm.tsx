"use client";

import { useState } from "react";
import { Search, MapPin, Loader2, Check } from "lucide-react";
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

type PlaceResult = {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
};

type MapOption = {
  id: string;
  name: string;
  user_display_name: string;
};

export function SpotSingleForm() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceResult | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<string>("");
  const [maps, setMaps] = useState<MapOption[]>([]);
  const [isLoadingMaps, setIsLoadingMaps] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // マップ一覧を取得
  const loadMaps = async () => {
    if (maps.length > 0) return;
    setIsLoadingMaps(true);
    try {
      const response = await fetch("/api/maps");
      if (response.ok) {
        const data = await response.json();
        setMaps(data);
      }
    } catch (error) {
      console.error("Failed to load maps:", error);
    } finally {
      setIsLoadingMaps(false);
    }
  };

  // Google Places検索
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setSearchResults([]);
    setSelectedPlace(null);
    setRegistrationResult(null);

    try {
      const response = await fetch(
        `/api/places/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results || []);
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // スポット登録
  const handleRegister = async () => {
    if (!selectedPlace || !selectedMapId) return;
    setIsRegistering(true);
    setRegistrationResult(null);

    try {
      const response = await fetch("/api/spots/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          google_place_id: selectedPlace.place_id,
          map_id: selectedMapId,
          custom_name: selectedPlace.name,
          latitude: selectedPlace.geometry.location.lat,
          longitude: selectedPlace.geometry.location.lng,
          formatted_address: selectedPlace.formatted_address,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setRegistrationResult({ success: true, message: "スポットを登録しました" });
        setSelectedPlace(null);
        setSearchResults([]);
        setSearchQuery("");
      } else {
        setRegistrationResult({ success: false, message: data.error || "登録に失敗しました" });
      }
    } catch (error) {
      setRegistrationResult({ success: false, message: "登録に失敗しました" });
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">個別登録</h2>
      <p className="mt-1 text-sm text-gray-600">
        Google Placesから場所を検索してスポットを登録します
      </p>

      <div className="mt-6 space-y-6">
        {/* マップ選択 */}
        <div className="space-y-2">
          <Label>登録先マップ</Label>
          <Select
            value={selectedMapId}
            onValueChange={setSelectedMapId}
            onOpenChange={(open) => open && loadMaps()}
          >
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="マップを選択..." />
            </SelectTrigger>
            <SelectContent>
              {isLoadingMaps ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                maps.map((map) => (
                  <SelectItem key={map.id} value={map.id}>
                    {map.name}
                    <span className="ml-2 text-gray-500">
                      ({map.user_display_name})
                    </span>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        {/* 検索フォーム */}
        <div className="space-y-2">
          <Label>場所を検索</Label>
          <div className="flex gap-2">
            <Input
              placeholder="場所名や住所を入力..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="max-w-md"
            />
            <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()}>
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              <span className="ml-2">検索</span>
            </Button>
          </div>
        </div>

        {/* 検索結果 */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <Label>検索結果</Label>
            <div className="max-h-64 overflow-y-auto rounded-lg border">
              {searchResults.map((place) => (
                <button
                  key={place.place_id}
                  onClick={() => setSelectedPlace(place)}
                  className={`flex w-full items-start gap-3 border-b p-3 text-left transition-colors last:border-b-0 hover:bg-gray-50 ${
                    selectedPlace?.place_id === place.place_id
                      ? "bg-blue-50"
                      : ""
                  }`}
                >
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
                  <div>
                    <div className="font-medium">{place.name}</div>
                    <div className="text-sm text-gray-500">
                      {place.formatted_address}
                    </div>
                  </div>
                  {selectedPlace?.place_id === place.place_id && (
                    <Check className="ml-auto h-5 w-5 text-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 選択中のスポット */}
        {selectedPlace && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium text-blue-900">{selectedPlace.name}</div>
                <div className="text-sm text-blue-700">
                  {selectedPlace.formatted_address}
                </div>
                <div className="mt-1 text-xs text-blue-600">
                  座標: {selectedPlace.geometry.location.lat.toFixed(6)},{" "}
                  {selectedPlace.geometry.location.lng.toFixed(6)}
                </div>
              </div>
            </div>
          </div>
        )}

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
          disabled={!selectedPlace || !selectedMapId || isRegistering}
          className="w-full max-w-md"
        >
          {isRegistering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              登録中...
            </>
          ) : (
            "スポットを登録"
          )}
        </Button>
      </div>
    </div>
  );
}
