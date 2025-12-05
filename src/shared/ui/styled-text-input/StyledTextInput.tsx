/**
 * スタイル付きTextInput
 *
 * iOSでIME入力時の未確定文字（下線）の問題に対応:
 * - Controlled Component (value + onChangeText) だとiOSのIMEで
 *   未確定文字の下線が消える問題がある
 * - この問題を回避するため、内部でUncontrolled的に動作させる
 */

import React, { forwardRef, useState, useEffect, useCallback, useRef } from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

export interface StyledTextInputProps extends Omit<TextInputProps, 'onChange'> {
  /** NativeWindのクラス名 */
  className?: string;
}

export const StyledTextInput = forwardRef<TextInput, StyledTextInputProps>(
  ({ className, style, placeholderTextColor, value, onChangeText, ...props }, ref) => {
    const isDarkMode = useIsDarkMode();
    const inputRef = useRef<TextInput>(null);

    // 内部状態を管理（IME入力中もネイティブ側で状態を保持するため）
    const [internalValue, setInternalValue] = useState(value ?? '');

    // 外部からvalueが変わった場合のみ内部状態を更新
    useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(value);
      }
    }, [value]);

    // onChangeTextのハンドラー
    const handleChangeText = useCallback((text: string) => {
      setInternalValue(text);
      onChangeText?.(text);
    }, [onChangeText]);

    // テキスト色（ダークモード対応）
    const textColor = isDarkMode ? colors.dark.foreground : colors.light.foreground;
    // プレースホルダー色
    const defaultPlaceholderColor = isDarkMode ? colors.gray[500] : colors.gray[400];

    // refを統合
    const setRefs = useCallback((instance: TextInput | null) => {
      (inputRef as React.MutableRefObject<TextInput | null>).current = instance;
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        (ref as React.MutableRefObject<TextInput | null>).current = instance;
      }
    }, [ref]);

    return (
      <TextInput
        ref={setRefs}
        className={className}
        style={[
          {
            color: textColor,
          },
          style,
        ]}
        // valueの代わりにdefaultValueを使用し、内部でstate管理
        // これによりiOSのIME入力中の再レンダリングを防ぐ
        defaultValue={internalValue}
        onChangeText={handleChangeText}
        placeholderTextColor={placeholderTextColor ?? defaultPlaceholderColor}
        // 選択範囲の色（半透明のプライマリカラー）
        selectionColor={`${colors.primary.DEFAULT}60`}
        // カーソル色
        cursorColor={colors.primary.DEFAULT}
        // Android用: 下線を消す
        underlineColorAndroid="transparent"
        // iOSキーボードの外観をダークモードに合わせる
        keyboardAppearance={isDarkMode ? 'dark' : 'light'}
        {...props}
      />
    );
  }
);

StyledTextInput.displayName = 'StyledTextInput';
