/**
 * search-places/model/types.ts のテスト
 *
 * 型ガード関数と変換関数のテスト
 */

import {
  isPlaceSearchResult,
  isManualLocationInput,
  convertToPlaceResult,
  type PlaceSearchResult,
  type ManualLocationInput,
  type SpotLocationInput,
} from '../types';
import type { GooglePlaceDetails } from '../../api/google-places.types';

describe('search-places types', () => {
  describe('isPlaceSearchResult', () => {
    it('googleDataを持つオブジェクトはtrue', () => {
      const input: PlaceSearchResult = {
        id: 'place123',
        name: 'テスト場所',
        shortAddress: '東京都渋谷区',
        formattedAddress: '東京都渋谷区神南1-1-1',
        latitude: 35.6580,
        longitude: 139.7016,
        category: ['restaurant'],
        googleData: {
          placeId: 'place123',
          placeName: 'テスト場所',
          category: ['restaurant'],
          shortAddress: '東京都渋谷区',
          formattedAddress: '東京都渋谷区神南1-1-1',
        },
      };

      expect(isPlaceSearchResult(input)).toBe(true);
    });

    it('googleDataを持たないオブジェクトはfalse', () => {
      const input: ManualLocationInput = {
        id: 'manual123',
        name: '現在地',
        shortAddress: null,
        formattedAddress: null,
        latitude: 35.6580,
        longitude: 139.7016,
        category: [],
        source: 'current_location',
      };

      expect(isPlaceSearchResult(input)).toBe(false);
    });
  });

  describe('isManualLocationInput', () => {
    it('sourceを持つオブジェクトはtrue', () => {
      const input: ManualLocationInput = {
        id: 'manual123',
        name: '現在地',
        shortAddress: null,
        formattedAddress: null,
        latitude: 35.6580,
        longitude: 139.7016,
        category: [],
        source: 'current_location',
      };

      expect(isManualLocationInput(input)).toBe(true);
    });

    it('map_pinソースでもtrue', () => {
      const input: ManualLocationInput = {
        id: 'pin123',
        name: 'ピンの場所',
        shortAddress: '東京都渋谷区',
        formattedAddress: '東京都渋谷区神南1-1-1',
        latitude: 35.6580,
        longitude: 139.7016,
        category: [],
        source: 'map_pin',
      };

      expect(isManualLocationInput(input)).toBe(true);
    });

    it('sourceを持たないオブジェクトはfalse', () => {
      const input: PlaceSearchResult = {
        id: 'place123',
        name: 'テスト場所',
        shortAddress: '東京都渋谷区',
        formattedAddress: '東京都渋谷区神南1-1-1',
        latitude: 35.6580,
        longitude: 139.7016,
        category: ['restaurant'],
        googleData: {
          placeId: 'place123',
          placeName: 'テスト場所',
          category: ['restaurant'],
          shortAddress: '東京都渋谷区',
          formattedAddress: '東京都渋谷区神南1-1-1',
        },
      };

      expect(isManualLocationInput(input)).toBe(false);
    });
  });

  describe('convertToPlaceResult', () => {
    it('基本的な変換ができる', () => {
      const details: GooglePlaceDetails = {
        id: 'ChIJ123',
        displayName: { text: '渋谷駅', languageCode: 'ja' },
        formattedAddress: '東京都渋谷区道玄坂1-1-1',
        location: { latitude: 35.6580, longitude: 139.7016 },
        types: ['train_station', 'transit_station'],
        addressComponents: [
          { longText: '東京都', shortText: '東京都', types: ['administrative_area_level_1'] },
          { longText: '渋谷区', shortText: '渋谷区', types: ['locality'] },
          { longText: '道玄坂', shortText: '道玄坂', types: ['sublocality_level_2'] },
        ],
      };

      const result = convertToPlaceResult(details);

      expect(result.id).toBe('ChIJ123');
      expect(result.name).toBe('渋谷駅');
      expect(result.latitude).toBe(35.6580);
      expect(result.longitude).toBe(139.7016);
      expect(result.category).toEqual(['train_station', 'transit_station']);
      expect(result.shortAddress).toBe('東京都渋谷区道玄坂');
      expect(result.formattedAddress).toBe('東京都渋谷区道玄坂1-1-1');
    });

    it('googleDataが正しく設定される', () => {
      const details: GooglePlaceDetails = {
        id: 'ChIJ456',
        displayName: { text: 'カフェ', languageCode: 'ja' },
        formattedAddress: '東京都新宿区西新宿1-1-1',
        location: { latitude: 35.6896, longitude: 139.6917 },
        types: ['cafe'],
        internationalPhoneNumber: '+81-3-1234-5678',
        websiteUri: 'https://example.com',
        rating: 4.5,
        userRatingCount: 100,
      };

      const result = convertToPlaceResult(details);

      expect(result.googleData.placeId).toBe('ChIJ456');
      expect(result.googleData.placeName).toBe('カフェ');
      expect(result.googleData.internationalPhoneNumber).toBe('+81-3-1234-5678');
      expect(result.googleData.websiteUri).toBe('https://example.com');
      expect(result.googleData.rating).toBe(4.5);
      expect(result.googleData.userRatingCount).toBe(100);
    });

    it('addressComponentsがない場合は空の短縮住所', () => {
      const details: GooglePlaceDetails = {
        id: 'ChIJ789',
        displayName: { text: 'テスト場所', languageCode: 'ja' },
        formattedAddress: '住所不明',
        location: { latitude: 35.0, longitude: 135.0 },
        types: [],
      };

      const result = convertToPlaceResult(details);

      expect(result.shortAddress).toBeNull();
    });

    it('sublocalityのフォールバック（level_1 → sublocality）', () => {
      const details: GooglePlaceDetails = {
        id: 'ChIJabc',
        displayName: { text: 'テスト', languageCode: 'ja' },
        formattedAddress: '東京都渋谷区神南',
        location: { latitude: 35.6580, longitude: 139.7016 },
        types: [],
        addressComponents: [
          { longText: '東京都', shortText: '東京都', types: ['administrative_area_level_1'] },
          { longText: '渋谷区', shortText: '渋谷区', types: ['locality'] },
          { longText: '神南', shortText: '神南', types: ['sublocality_level_1'] },
        ],
      };

      const result = convertToPlaceResult(details);

      expect(result.shortAddress).toBe('東京都渋谷区神南');
    });

    it('localityがない場合はadministrative_area_level_2を使用', () => {
      const details: GooglePlaceDetails = {
        id: 'ChIJdef',
        displayName: { text: 'テスト', languageCode: 'ja' },
        formattedAddress: '北海道札幌市',
        location: { latitude: 43.0618, longitude: 141.3545 },
        types: [],
        addressComponents: [
          { longText: '北海道', shortText: '北海道', types: ['administrative_area_level_1'] },
          { longText: '札幌市', shortText: '札幌市', types: ['administrative_area_level_2'] },
        ],
      };

      const result = convertToPlaceResult(details);

      expect(result.shortAddress).toBe('北海道札幌市');
    });

    it('typesがundefinedの場合は空配列', () => {
      const details: GooglePlaceDetails = {
        id: 'ChIJghi',
        displayName: { text: 'テスト', languageCode: 'ja' },
        formattedAddress: '住所',
        location: { latitude: 35.0, longitude: 135.0 },
        types: undefined as any,
      };

      const result = convertToPlaceResult(details);

      expect(result.category).toEqual([]);
      expect(result.googleData.category).toEqual([]);
    });

    it('formattedAddressがundefinedの場合はnull', () => {
      const details: GooglePlaceDetails = {
        id: 'ChIJjkl',
        displayName: { text: 'テスト', languageCode: 'ja' },
        formattedAddress: undefined as any,
        location: { latitude: 35.0, longitude: 135.0 },
        types: [],
      };

      const result = convertToPlaceResult(details);

      expect(result.formattedAddress).toBeNull();
      expect(result.googleData.formattedAddress).toBeNull();
    });
  });
});
