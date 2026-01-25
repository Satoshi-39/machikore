/**
 * 利用規約・プライバシーポリシー用マークダウンレンダラー
 *
 * シンプルなマークダウンをReact Nativeコンポーネントに変換
 */

import React from 'react';
import { View, Text } from 'react-native';
import { formatJapaneseDate } from '@/shared/lib/utils/date.utils';

interface TermsMarkdownRendererProps {
  /** マークダウンコンテンツ */
  content: string;
  /** 施行日（タイトル下に表示） */
  effectiveAt?: string;
}

/**
 * 利用規約・プライバシーポリシー用マークダウンレンダラー
 */
export function TermsMarkdownRenderer({ content, effectiveAt }: TermsMarkdownRendererProps) {
  const lines = content.trim().split('\n');

  return (
    <>
      {lines.map((line, index) => {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          return <View key={index} className="h-3" />;
        }

        // H1（タイトル）- 前後に広めの余白、施行日をその下に表示
        if (trimmedLine.startsWith('# ')) {
          return (
            <View key={index} className="mt-6 mb-8">
              <Text className="text-2xl font-bold text-on-surface text-center">
                {trimmedLine.slice(2)}
              </Text>
              {effectiveAt && (
                <Text className="text-sm text-on-surface-variant text-center mt-3">
                  {formatJapaneseDate(effectiveAt)} 施行
                </Text>
              )}
            </View>
          );
        }

        // H2
        if (trimmedLine.startsWith('## ')) {
          return (
            <Text
              key={index}
              className="text-xl font-bold text-on-surface mt-6 mb-3"
            >
              {trimmedLine.slice(3)}
            </Text>
          );
        }

        // H3
        if (trimmedLine.startsWith('### ')) {
          return (
            <Text
              key={index}
              className="text-lg font-semibold text-on-surface mt-4 mb-2"
            >
              {trimmedLine.slice(4)}
            </Text>
          );
        }

        // 水平線
        if (trimmedLine === '---') {
          return (
            <View
              key={index}
              className="h-px bg-border-light my-6"
            />
          );
        }

        // 箇条書き
        if (trimmedLine.startsWith('- ')) {
          return (
            <View key={index} className="flex-row mb-1 pl-2">
              <Text className="text-on-surface mr-2">•</Text>
              <Text className="flex-1 text-base text-on-surface leading-6">
                {trimmedLine.slice(2).replace(/\*\*([^*]+)\*\*/g, '$1')}
              </Text>
            </View>
          );
        }

        // 番号付きリスト
        const numberedMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch && numberedMatch[1] && numberedMatch[2]) {
          return (
            <View key={index} className="flex-row mb-1 pl-2">
              <Text className="text-on-surface mr-2 w-6">
                {numberedMatch[1]}.
              </Text>
              <Text className="flex-1 text-base text-on-surface leading-6">
                {numberedMatch[2].replace(/\*\*([^*]+)\*\*/g, '$1')}
              </Text>
            </View>
          );
        }

        // 通常のテキスト
        return (
          <Text
            key={index}
            className="text-base text-on-surface leading-6 mb-2"
          >
            {trimmedLine.replace(/\*\*([^*]+)\*\*/g, '$1')}
          </Text>
        );
      })}
    </>
  );
}
