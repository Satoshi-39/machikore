/**
 * 国データ読み込みユーティリティ
 */

import type { CountryRow } from '@/shared/types/database.types';

// 各大陸の国データをインポート
import eastAsiaCountries from '@/shared/assets/data/countries/east_asia.json';
import southeastAsiaCountries from '@/shared/assets/data/countries/southeast_asia.json';
import southAsiaCountries from '@/shared/assets/data/countries/south_asia.json';
import middleEastCountries from '@/shared/assets/data/countries/middle_east.json';
import europeCountries from '@/shared/assets/data/countries/europe.json';
import northAmericaCountries from '@/shared/assets/data/countries/north_america.json';
import southAmericaCountries from '@/shared/assets/data/countries/south_america.json';
import oceaniaCountries from '@/shared/assets/data/countries/oceania.json';
import africaCountries from '@/shared/assets/data/countries/africa.json';

// 国データの型（JSONから読み込む形式）
// Note: JSONのidはcountry_code(jp, kr, cn...)になっている
interface CountryJsonData {
  id: string; // country_code (jp, kr, cn...)
  name: string;
  name_kana: string;
  name_translations?: { en: string };
  latitude: number;
  longitude: number;
}

// 大陸IDと国データのマッピング
const countriesByContinent: Record<string, CountryJsonData[]> = {
  east_asia: eastAsiaCountries as CountryJsonData[],
  southeast_asia: southeastAsiaCountries as CountryJsonData[],
  south_asia: southAsiaCountries as CountryJsonData[],
  middle_east: middleEastCountries as CountryJsonData[],
  europe: europeCountries as CountryJsonData[],
  north_america: northAmericaCountries as CountryJsonData[],
  south_america: southAmericaCountries as CountryJsonData[],
  oceania: oceaniaCountries as CountryJsonData[],
  africa: africaCountries as CountryJsonData[],
};

/**
 * JSONデータをCountryRowに変換
 * Note: countries.idは国コード（jp, kr, cn...）
 */
function toCountryRow(country: CountryJsonData, continentId: string): CountryRow {
  const now = new Date().toISOString();
  return {
    id: country.id, // idがcountry_code
    name: country.name,
    name_kana: country.name_kana,
    latitude: country.latitude,
    longitude: country.longitude,
    continent_id: continentId,
    name_translations: country.name_translations ? JSON.stringify(country.name_translations) : null,
    created_at: now,
    updated_at: now,
  };
}

/**
 * 全ての国データを取得（JSONから）
 */
export function getCountriesData(): CountryRow[] {
  return Object.entries(countriesByContinent).flatMap(([continentId, countries]) =>
    countries.map((country) => toCountryRow(country, continentId))
  );
}

/**
 * 特定の大陸の国データを取得
 */
export function getCountriesByContinent(continentId: string): CountryRow[] {
  const countries = countriesByContinent[continentId];
  if (!countries) {
    return [];
  }
  return countries.map((country) => toCountryRow(country, continentId));
}

/**
 * 国コードから国データを取得
 * Note: countries.idは国コード（jp, kr, cn...）なのでidで検索
 */
export function getCountryByCode(countryCode: string): CountryRow | undefined {
  return getCountriesData().find((c) => c.id === countryCode);
}

/**
 * 利用可能な大陸IDの一覧を取得
 */
export function getAvailableContinentIds(): string[] {
  return Object.keys(countriesByContinent);
}

/**
 * 利用可能な国コードの一覧を取得
 * Note: countries.idは国コード（jp, kr, cn...）
 */
export function getAvailableCountryCodes(): string[] {
  return getCountriesData().map((c) => c.id);
}
