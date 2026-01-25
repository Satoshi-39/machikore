/**
 * Input コンポーネント
 *
 * react-native-reusables パターンに準拠したテキスト入力コンポーネント
 *
 * iOSでIME入力時の未確定文字（下線）の問題に対応:
 * - Controlled Component (value + onChangeText) だとiOSのIMEで
 *   未確定文字の下線が消える問題がある
 * - この問題を回避するため、内部でUncontrolled的に動作させる
 */

import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/shared/lib/utils';
import { colors } from '@/shared/config';
import { useIsDarkMode } from '@/shared/lib/providers';

export interface InputProps extends Omit<TextInputProps, 'onChange'> {
  /** 追加のクラス名 */
  className?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, style, placeholderTextColor, value, onChangeText, editable = true, ...props }, ref) => {
    const isDarkMode = useIsDarkMode();
    const inputRef = React.useRef<TextInput>(null);

    // 内部状態を管理（IME入力中もネイティブ側で状態を保持するため）
    const [internalValue, setInternalValue] = React.useState(value ?? '');

    // 外部からvalueが変わった場合のみ内部状態を更新
    React.useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(value);
      }
    }, [value]);

    // onChangeTextのハンドラー
    const handleChangeText = React.useCallback((text: string) => {
      setInternalValue(text);
      onChangeText?.(text);
    }, [onChangeText]);

    // テキスト色（ダークモード対応）
    const textColor = isDarkMode ? colors.dark['on-surface'] : colors.light['on-surface'];
    // プレースホルダー色
    const defaultPlaceholderColor = isDarkMode ? colors.gray[500] : colors.gray[400];

    // refを統合
    const setRefs = React.useCallback((instance: TextInput | null) => {
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
        className={cn(
          'w-full rounded-lg border border-border dark:border-dark-border bg-surface dark:bg-dark-surface px-4 py-3 text-base text-foreground dark:text-dark-foreground',
          !editable && 'opacity-50',
          className
        )}
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
        editable={editable}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
