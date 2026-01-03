/**
 * constants.ts のテスト
 *
 * 純粋関数と定数のテスト
 */

import {
  SPOT_COLORS,
  SPOT_COLOR_LIST,
  DEFAULT_SPOT_COLOR,
  getSpotColorStroke,
  type SpotColor,
} from '../constants';

describe('constants', () => {
  describe('SPOT_COLORS', () => {
    it('9色が定義されている', () => {
      const colors = Object.keys(SPOT_COLORS);
      expect(colors).toHaveLength(9);
    });

    it('各色にcolor, labelが定義されている', () => {
      Object.values(SPOT_COLORS).forEach((config) => {
        expect(config.color).toBeDefined();
        expect(config.label).toBeDefined();
        expect(config.color).toMatch(/^#[0-9A-F]{6}$/i);
      });
    });

    it('デフォルトカラーはblue', () => {
      expect(DEFAULT_SPOT_COLOR).toBe('blue');
    });

    it('blueが存在する', () => {
      expect(SPOT_COLORS.blue).toBeDefined();
      expect(SPOT_COLORS.blue.color).toBe('#3B82F6');
    });

    it('whiteはuseOutlinedIconInLightが設定されている', () => {
      expect(SPOT_COLORS.white.useOutlinedIconInLight).toBe(true);
    });

    it('grayはuseOutlinedIconInDarkが設定されている', () => {
      expect(SPOT_COLORS.gray.useOutlinedIconInDark).toBe(true);
    });
  });

  describe('SPOT_COLOR_LIST', () => {
    it('配列として9色が含まれている', () => {
      expect(SPOT_COLOR_LIST).toHaveLength(9);
    });

    it('各要素にkeyが含まれている', () => {
      SPOT_COLOR_LIST.forEach((item) => {
        expect(item.key).toBeDefined();
        expect(typeof item.key).toBe('string');
      });
    });

    it('各要素にcolor, labelが含まれている', () => {
      SPOT_COLOR_LIST.forEach((item) => {
        expect(item.color).toBeDefined();
        expect(item.label).toBeDefined();
      });
    });

    it('SPOT_COLORSと同じ色を含む', () => {
      const listKeys = SPOT_COLOR_LIST.map((item) => item.key);
      const colorKeys = Object.keys(SPOT_COLORS);
      expect(listKeys.sort()).toEqual(colorKeys.sort());
    });
  });

  describe('getSpotColorStroke', () => {
    describe('ライトモード', () => {
      it('whiteは縁取りが必要（グレーの縁取り）', () => {
        const stroke = getSpotColorStroke('white', false);
        expect(stroke).toBe('#374151');
      });

      it('blueは縁取り不要', () => {
        const stroke = getSpotColorStroke('blue', false);
        expect(stroke).toBeUndefined();
      });

      it('redは縁取り不要', () => {
        const stroke = getSpotColorStroke('red', false);
        expect(stroke).toBeUndefined();
      });

      it('grayは縁取り不要（ライトモードでは）', () => {
        const stroke = getSpotColorStroke('gray', false);
        expect(stroke).toBeUndefined();
      });

      it('yellowは縁取り不要', () => {
        const stroke = getSpotColorStroke('yellow', false);
        expect(stroke).toBeUndefined();
      });
    });

    describe('ダークモード', () => {
      it('grayは縁取りが必要（白の縁取り）', () => {
        const stroke = getSpotColorStroke('gray', true);
        expect(stroke).toBe('#FFFFFF');
      });

      it('whiteは縁取り不要（ダークモードでは）', () => {
        const stroke = getSpotColorStroke('white', true);
        expect(stroke).toBeUndefined();
      });

      it('blueは縁取り不要', () => {
        const stroke = getSpotColorStroke('blue', true);
        expect(stroke).toBeUndefined();
      });

      it('redは縁取り不要', () => {
        const stroke = getSpotColorStroke('red', true);
        expect(stroke).toBeUndefined();
      });
    });

    describe('エッジケース', () => {
      it('すべてのSpotColorで動作する', () => {
        const colors: SpotColor[] = [
          'red',
          'orange',
          'yellow',
          'green',
          'blue',
          'purple',
          'gray',
          'white',
          'pink',
        ];

        colors.forEach((color) => {
          // ライトモード
          const lightStroke = getSpotColorStroke(color, false);
          expect(lightStroke === undefined || typeof lightStroke === 'string').toBe(true);

          // ダークモード
          const darkStroke = getSpotColorStroke(color, true);
          expect(darkStroke === undefined || typeof darkStroke === 'string').toBe(true);
        });
      });

      it('無効なカラーはundefinedを返す', () => {
        const stroke = getSpotColorStroke('invalid' as SpotColor, false);
        expect(stroke).toBeUndefined();
      });
    });
  });
});
