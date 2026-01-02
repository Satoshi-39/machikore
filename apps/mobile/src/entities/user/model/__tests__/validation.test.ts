/**
 * validation.ts のテスト
 */

import {
  validateUsername,
  sanitizeUsername,
  isDisplayNameEmpty,
} from '../validation';

describe('user/validation', () => {
  describe('validateUsername', () => {
    it('空文字列はusernameRequiredを返す', () => {
      expect(validateUsername('')).toBe('usernameRequired');
    });

    it('3文字未満はusernameTooShortを返す', () => {
      expect(validateUsername('ab')).toBe('usernameTooShort');
      expect(validateUsername('a')).toBe('usernameTooShort');
    });

    it('3文字はOK', () => {
      expect(validateUsername('abc')).toBeNull();
    });

    it('20文字はOK', () => {
      expect(validateUsername('a'.repeat(20))).toBeNull();
    });

    it('21文字以上はusernameTooLongを返す', () => {
      expect(validateUsername('a'.repeat(21))).toBe('usernameTooLong');
    });

    it('英数字とアンダースコアのみ許可', () => {
      expect(validateUsername('user_123')).toBeNull();
      expect(validateUsername('User_Name')).toBeNull();
      expect(validateUsername('ABC123')).toBeNull();
    });

    it('特殊文字を含むとusernameInvalidを返す', () => {
      expect(validateUsername('user-name')).toBe('usernameInvalid');
      expect(validateUsername('user.name')).toBe('usernameInvalid');
      expect(validateUsername('user@name')).toBe('usernameInvalid');
      expect(validateUsername('user name')).toBe('usernameInvalid');
    });

    it('日本語を含むとusernameInvalidを返す', () => {
      expect(validateUsername('ユーザー')).toBe('usernameInvalid');
      expect(validateUsername('user名前')).toBe('usernameInvalid');
    });

    it('絵文字を含むとusernameInvalidを返す', () => {
      expect(validateUsername('user🎉')).toBe('usernameInvalid');
    });
  });

  describe('sanitizeUsername', () => {
    it('大文字を小文字に変換する', () => {
      expect(sanitizeUsername('UserName')).toBe('username');
      expect(sanitizeUsername('ABC')).toBe('abc');
    });

    it('不正な文字を除去する', () => {
      expect(sanitizeUsername('user-name')).toBe('username');
      expect(sanitizeUsername('user.name')).toBe('username');
      expect(sanitizeUsername('user@name')).toBe('username');
    });

    it('スペースを除去する', () => {
      expect(sanitizeUsername('user name')).toBe('username');
      expect(sanitizeUsername('  user  ')).toBe('user');
    });

    it('アンダースコアは保持する', () => {
      expect(sanitizeUsername('user_name')).toBe('user_name');
      expect(sanitizeUsername('User_Name_123')).toBe('user_name_123');
    });

    it('日本語を除去する', () => {
      expect(sanitizeUsername('userユーザー')).toBe('user');
      expect(sanitizeUsername('日本語のみ')).toBe('');
    });

    it('絵文字を除去する', () => {
      expect(sanitizeUsername('user🎉name')).toBe('username');
    });

    it('空文字列はそのまま返す', () => {
      expect(sanitizeUsername('')).toBe('');
    });
  });

  describe('isDisplayNameEmpty', () => {
    it('空文字列はtrueを返す', () => {
      expect(isDisplayNameEmpty('')).toBe(true);
    });

    it('スペースのみはtrueを返す', () => {
      expect(isDisplayNameEmpty('   ')).toBe(true);
      expect(isDisplayNameEmpty('\t')).toBe(true);
      expect(isDisplayNameEmpty('\n')).toBe(true);
    });

    it('通常の文字列はfalseを返す', () => {
      expect(isDisplayNameEmpty('太郎')).toBe(false);
      expect(isDisplayNameEmpty('John')).toBe(false);
    });

    it('前後にスペースがあっても中身があればfalse', () => {
      expect(isDisplayNameEmpty('  太郎  ')).toBe(false);
    });
  });
});
