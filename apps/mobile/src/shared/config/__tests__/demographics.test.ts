/**
 * demographics.ts のテスト
 */

import {
  GENDERS,
  GENDER_LABELS,
  AGE_GROUPS,
  AGE_GROUP_LABELS,
  type Gender,
  type AgeGroup,
} from '../demographics';

describe('demographics', () => {
  describe('GENDERS', () => {
    it('3つの性別オプションが定義されている', () => {
      expect(GENDERS).toHaveLength(3);
    });

    it('maleが含まれている', () => {
      expect(GENDERS).toContain('male');
    });

    it('femaleが含まれている', () => {
      expect(GENDERS).toContain('female');
    });

    it('otherが含まれている', () => {
      expect(GENDERS).toContain('other');
    });

    it('順序がmale, female, otherである', () => {
      expect(GENDERS[0]).toBe('male');
      expect(GENDERS[1]).toBe('female');
      expect(GENDERS[2]).toBe('other');
    });
  });

  describe('GENDER_LABELS', () => {
    it('すべてのGENDERSにラベルが定義されている', () => {
      GENDERS.forEach((gender) => {
        expect(GENDER_LABELS[gender]).toBeDefined();
        expect(typeof GENDER_LABELS[gender]).toBe('string');
      });
    });

    it('maleは「男性」', () => {
      expect(GENDER_LABELS.male).toBe('男性');
    });

    it('femaleは「女性」', () => {
      expect(GENDER_LABELS.female).toBe('女性');
    });

    it('otherは「その他」', () => {
      expect(GENDER_LABELS.other).toBe('その他');
    });
  });

  describe('AGE_GROUPS', () => {
    it('6つの年代オプションが定義されている', () => {
      expect(AGE_GROUPS).toHaveLength(6);
    });

    it('10sが含まれている', () => {
      expect(AGE_GROUPS).toContain('10s');
    });

    it('20sが含まれている', () => {
      expect(AGE_GROUPS).toContain('20s');
    });

    it('30sが含まれている', () => {
      expect(AGE_GROUPS).toContain('30s');
    });

    it('40sが含まれている', () => {
      expect(AGE_GROUPS).toContain('40s');
    });

    it('50sが含まれている', () => {
      expect(AGE_GROUPS).toContain('50s');
    });

    it('60s+が含まれている', () => {
      expect(AGE_GROUPS).toContain('60s+');
    });

    it('順序が10s, 20s, 30s, 40s, 50s, 60s+である', () => {
      expect(AGE_GROUPS[0]).toBe('10s');
      expect(AGE_GROUPS[1]).toBe('20s');
      expect(AGE_GROUPS[2]).toBe('30s');
      expect(AGE_GROUPS[3]).toBe('40s');
      expect(AGE_GROUPS[4]).toBe('50s');
      expect(AGE_GROUPS[5]).toBe('60s+');
    });
  });

  describe('AGE_GROUP_LABELS', () => {
    it('すべてのAGE_GROUPSにラベルが定義されている', () => {
      AGE_GROUPS.forEach((ageGroup) => {
        expect(AGE_GROUP_LABELS[ageGroup]).toBeDefined();
        expect(typeof AGE_GROUP_LABELS[ageGroup]).toBe('string');
      });
    });

    it('10sは「10代」', () => {
      expect(AGE_GROUP_LABELS['10s']).toBe('10代');
    });

    it('20sは「20代」', () => {
      expect(AGE_GROUP_LABELS['20s']).toBe('20代');
    });

    it('30sは「30代」', () => {
      expect(AGE_GROUP_LABELS['30s']).toBe('30代');
    });

    it('40sは「40代」', () => {
      expect(AGE_GROUP_LABELS['40s']).toBe('40代');
    });

    it('50sは「50代」', () => {
      expect(AGE_GROUP_LABELS['50s']).toBe('50代');
    });

    it('60s+は「60代以上」', () => {
      expect(AGE_GROUP_LABELS['60s+']).toBe('60代以上');
    });
  });

  describe('型の整合性', () => {
    it('Gender型はGENDERSの要素と一致', () => {
      const genders: Gender[] = ['male', 'female', 'other'];
      genders.forEach((gender) => {
        expect(GENDERS).toContain(gender);
      });
    });

    it('AgeGroup型はAGE_GROUPSの要素と一致', () => {
      const ageGroups: AgeGroup[] = ['10s', '20s', '30s', '40s', '50s', '60s+'];
      ageGroups.forEach((ageGroup) => {
        expect(AGE_GROUPS).toContain(ageGroup);
      });
    });
  });
});
