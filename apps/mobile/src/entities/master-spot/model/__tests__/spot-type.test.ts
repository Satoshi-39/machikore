/**
 * spot-type.ts のテスト
 */

import { determineSpotCategory, type SpotCategory } from '../spot-type';

describe('master-spot/spot-type', () => {
  describe('determineSpotCategory', () => {
    describe('食べ物カテゴリ', () => {
      it('restaurantを含む場合はfoodを返す', () => {
        expect(determineSpotCategory(['restaurant'])).toBe('food');
        expect(determineSpotCategory(['japanese_restaurant'])).toBe('food');
        expect(determineSpotCategory(['restaurant', 'point_of_interest'])).toBe('food');
      });

      it('cafeを含む場合はfoodを返す', () => {
        expect(determineSpotCategory(['cafe'])).toBe('food');
        expect(determineSpotCategory(['cafe', 'establishment'])).toBe('food');
      });

      it('foodを含む場合はfoodを返す', () => {
        expect(determineSpotCategory(['food'])).toBe('food');
        expect(determineSpotCategory(['food_court'])).toBe('food');
      });

      it('barを含む場合はfoodを返す', () => {
        expect(determineSpotCategory(['bar'])).toBe('food');
        expect(determineSpotCategory(['wine_bar'])).toBe('food');
      });

      it('mealを含む場合はfoodを返す', () => {
        expect(determineSpotCategory(['meal_delivery'])).toBe('food');
        expect(determineSpotCategory(['meal_takeaway'])).toBe('food');
      });
    });

    describe('ショッピングカテゴリ', () => {
      it('storeを含む場合はshoppingを返す', () => {
        expect(determineSpotCategory(['store'])).toBe('shopping');
        expect(determineSpotCategory(['clothing_store'])).toBe('shopping');
        expect(determineSpotCategory(['convenience_store'])).toBe('shopping');
      });

      it('shopを含む場合はshoppingを返す', () => {
        expect(determineSpotCategory(['shop'])).toBe('shopping');
        expect(determineSpotCategory(['coffee_shop'])).toBe('shopping');
      });

      it('shoppingを含む場合はshoppingを返す', () => {
        expect(determineSpotCategory(['shopping_mall'])).toBe('shopping');
      });

      it('mallを含む場合はshoppingを返す', () => {
        expect(determineSpotCategory(['mall'])).toBe('shopping');
      });
    });

    describe('観光カテゴリ', () => {
      it('parkを含む場合はtourismを返す', () => {
        expect(determineSpotCategory(['park'])).toBe('tourism');
        expect(determineSpotCategory(['amusement_park'])).toBe('tourism');
      });

      it('touristを含む場合はtourismを返す', () => {
        expect(determineSpotCategory(['tourist_attraction'])).toBe('tourism');
      });

      it('museumを含む場合はtourismを返す', () => {
        expect(determineSpotCategory(['museum'])).toBe('tourism');
        expect(determineSpotCategory(['art_museum'])).toBe('tourism');
      });

      it('attractionを含む場合はtourismを返す', () => {
        expect(determineSpotCategory(['attraction'])).toBe('tourism');
      });
    });

    describe('交通カテゴリ', () => {
      it('stationを含む場合はtransitを返す', () => {
        expect(determineSpotCategory(['train_station'])).toBe('transit');
        expect(determineSpotCategory(['subway_station'])).toBe('transit');
        expect(determineSpotCategory(['bus_station'])).toBe('transit');
      });

      it('airportを含む場合はtransitを返す', () => {
        expect(determineSpotCategory(['airport'])).toBe('transit');
      });

      it('transitを含む場合はtransitを返す', () => {
        expect(determineSpotCategory(['transit_station'])).toBe('transit');
      });
    });

    describe('その他カテゴリ', () => {
      it('該当しないタイプはotherを返す', () => {
        expect(determineSpotCategory(['hospital'])).toBe('other');
        expect(determineSpotCategory(['school'])).toBe('other');
        expect(determineSpotCategory(['church'])).toBe('other');
        expect(determineSpotCategory(['library'])).toBe('other');
      });
    });

    describe('優先順位', () => {
      it('foodはshoppingより優先される', () => {
        // coffee_shop は shop を含むが、cafe も含む場合は food になる
        // 実際は restaurant と store の組み合わせで確認
        expect(determineSpotCategory(['restaurant', 'store'])).toBe('food');
      });

      it('shoppingはtourismより優先される', () => {
        expect(determineSpotCategory(['store', 'park'])).toBe('shopping');
      });

      it('tourismはtransitより優先される', () => {
        expect(determineSpotCategory(['museum', 'transit_station'])).toBe('tourism');
      });
    });

    describe('JSON文字列入力', () => {
      it('JSON配列文字列をパースする', () => {
        expect(determineSpotCategory('["restaurant", "food"]')).toBe('food');
        expect(determineSpotCategory('["store"]')).toBe('shopping');
        expect(determineSpotCategory('["park"]')).toBe('tourism');
      });

      it('無効なJSON文字列はotherを返す', () => {
        expect(determineSpotCategory('not valid json')).toBe('other');
        expect(determineSpotCategory('{"invalid": true}')).toBe('other');
        expect(determineSpotCategory('[incomplete')).toBe('other');
      });

      it('空のJSON配列はotherを返す', () => {
        expect(determineSpotCategory('[]')).toBe('other');
      });
    });

    describe('null・空配列', () => {
      it('nullはotherを返す', () => {
        expect(determineSpotCategory(null)).toBe('other');
      });

      it('空配列はotherを返す', () => {
        expect(determineSpotCategory([])).toBe('other');
      });
    });

    describe('大文字小文字', () => {
      it('大文字小文字を区別しない', () => {
        expect(determineSpotCategory(['RESTAURANT'])).toBe('food');
        expect(determineSpotCategory(['Restaurant'])).toBe('food');
        expect(determineSpotCategory(['STORE'])).toBe('shopping');
      });
    });
  });
});
