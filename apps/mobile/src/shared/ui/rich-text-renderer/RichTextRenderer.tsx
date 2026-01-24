/**
 * ProseMirror JSONをReact Nativeコンポーネントとしてレンダリング
 *
 * TipTapエディタで作成したJSONコンテンツを表示用にレンダリングする
 */

import React from 'react';
import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import type { ProseMirrorDoc, ProseMirrorNode } from '@/shared/types';
import { OptimizedImage } from '../OptimizedImage';

interface RichTextRendererProps {
  /** ProseMirror JSON形式のドキュメント */
  content: ProseMirrorDoc | null | undefined;
  /** テキストのベースクラス（Tailwind） */
  textClassName?: string;
  /** 画像タップ時のコールバック */
  onImagePress?: (imageUrl: string) => void;
}

/**
 * ProseMirror JSONをReact Nativeでレンダリング
 */
export function RichTextRenderer({
  content,
  textClassName = 'text-sm text-foreground dark:text-dark-foreground leading-relaxed',
  onImagePress,
}: RichTextRendererProps) {
  if (!content || !content.content || content.content.length === 0) {
    return null;
  }

  return (
    <View>
      {content.content.map((node, index) => (
        <RenderNode key={index} node={node} textClassName={textClassName} onImagePress={onImagePress} />
      ))}
    </View>
  );
}

interface RenderNodeProps {
  node: ProseMirrorNode;
  textClassName: string;
  onImagePress?: (imageUrl: string) => void;
}

/**
 * 個別のノードをレンダリング
 */
function RenderNode({ node, textClassName, onImagePress }: RenderNodeProps) {
  switch (node.type) {
    case 'paragraph':
      return <ParagraphNode node={node} textClassName={textClassName} />;

    case 'heading':
      return <HeadingNode node={node} />;

    case 'bulletList':
      return <BulletListNode node={node} textClassName={textClassName} onImagePress={onImagePress} />;

    case 'orderedList':
      return <OrderedListNode node={node} textClassName={textClassName} onImagePress={onImagePress} />;

    case 'listItem':
      return <ListItemNode node={node} textClassName={textClassName} onImagePress={onImagePress} />;

    case 'blockquote':
      return <BlockquoteNode node={node} textClassName={textClassName} onImagePress={onImagePress} />;

    case 'codeBlock':
      return <CodeBlockNode node={node} />;

    case 'horizontalRule':
      return <HorizontalRuleNode />;

    case 'hardBreak':
      return <Text>{'\n'}</Text>;

    case 'image':
      return <ImageNode node={node} onImagePress={onImagePress} />;

    default:
      // 未知のノードタイプは子要素をレンダリング
      if (node.content) {
        return (
          <View>
            {node.content.map((child, index) => (
              <RenderNode key={index} node={child} textClassName={textClassName} onImagePress={onImagePress} />
            ))}
          </View>
        );
      }
      return null;
  }
}

/**
 * 段落ノード
 */
function ParagraphNode({ node, textClassName }: RenderNodeProps) {
  if (!node.content || node.content.length === 0) {
    // 空の段落は余白として表示
    return <View className="h-4" />;
  }

  return (
    <Text className={`${textClassName} mb-2`}>
      <RenderInlineContent content={node.content} />
    </Text>
  );
}

/**
 * 見出しノード
 */
function HeadingNode({ node }: { node: ProseMirrorNode }) {
  const level = (node.attrs?.level as number) || 1;

  const headingClasses: Record<number, string> = {
    1: 'text-xl font-bold text-foreground dark:text-dark-foreground mb-3',
    2: 'text-lg font-bold text-foreground dark:text-dark-foreground mb-2',
    3: 'text-base font-semibold text-foreground dark:text-dark-foreground mb-2',
  };

  const className = headingClasses[level] || headingClasses[3];

  return (
    <Text className={className}>
      {node.content && <RenderInlineContent content={node.content} />}
    </Text>
  );
}

/**
 * 箇条書きリスト
 */
function BulletListNode({ node, textClassName, onImagePress }: RenderNodeProps) {
  if (!node.content) return null;

  return (
    <View className="mb-2 ml-4">
      {node.content.map((item, index) => (
        <View key={index} className="flex-row">
          <Text className={textClassName}>• </Text>
          <View className="flex-1">
            <RenderNode node={item} textClassName={textClassName} onImagePress={onImagePress} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * 番号付きリスト
 */
function OrderedListNode({ node, textClassName, onImagePress }: RenderNodeProps) {
  if (!node.content) return null;

  return (
    <View className="mb-2 ml-4">
      {node.content.map((item, index) => (
        <View key={index} className="flex-row">
          <Text className={textClassName}>{index + 1}. </Text>
          <View className="flex-1">
            <RenderNode node={item} textClassName={textClassName} onImagePress={onImagePress} />
          </View>
        </View>
      ))}
    </View>
  );
}

/**
 * リストアイテム
 */
function ListItemNode({ node, textClassName, onImagePress }: RenderNodeProps) {
  if (!node.content) return null;

  return (
    <View>
      {node.content.map((child, index) => (
        <RenderNode key={index} node={child} textClassName={textClassName} onImagePress={onImagePress} />
      ))}
    </View>
  );
}

/**
 * 引用ブロック
 */
function BlockquoteNode({ node, textClassName, onImagePress }: RenderNodeProps) {
  if (!node.content) return null;

  return (
    <View className="border-l-4 border-gray-300 dark:border-gray-600 pl-3 mb-2">
      {node.content.map((child, index) => (
        <RenderNode
          key={index}
          node={child}
          textClassName={`${textClassName} italic text-foreground-secondary dark:text-dark-foreground-secondary`}
          onImagePress={onImagePress}
        />
      ))}
    </View>
  );
}

/**
 * コードブロック
 */
function CodeBlockNode({ node }: { node: ProseMirrorNode }) {
  const code = node.content?.map(n => n.text || '').join('') || '';

  return (
    <View className="bg-muted dark:bg-dark-muted rounded-lg p-3 mb-2">
      <Text className="font-mono text-sm text-foreground dark:text-dark-foreground">
        {code}
      </Text>
    </View>
  );
}

/**
 * 水平線
 */
function HorizontalRuleNode() {
  return <View className="h-px bg-border dark:bg-dark-border my-4" />;
}

/**
 * 画像ノード
 */
function ImageNode({ node, onImagePress }: { node: ProseMirrorNode; onImagePress?: (imageUrl: string) => void }) {
  const { width: screenWidth } = useWindowDimensions();
  const src = node.attrs?.src as string | undefined;

  if (!src) return null;

  // 画像の幅をコンテンツ幅に合わせる（左右パディング32pxを考慮）
  const imageWidth = screenWidth - 32;
  // アスペクト比4:3で高さを計算
  const imageHeight = Math.round(imageWidth * 0.75);

  const handlePress = () => {
    onImagePress?.(src);
  };

  return (
    <Pressable onPress={handlePress} className="mb-4 rounded-lg overflow-hidden">
      <OptimizedImage
        url={src}
        width={imageWidth}
        height={imageHeight}
        borderRadius={8}
        quality={85}
      />
    </Pressable>
  );
}

/**
 * インラインコンテンツ（テキスト、太字、イタリック等）をレンダリング
 */
function RenderInlineContent({ content }: { content: ProseMirrorNode[] }) {
  return (
    <>
      {content.map((node, index) => {
        if (node.type === 'text') {
          return <RenderTextNode key={index} node={node} />;
        }
        if (node.type === 'hardBreak') {
          return <Text key={index}>{'\n'}</Text>;
        }
        // その他のインラインノード
        return null;
      })}
    </>
  );
}

/**
 * テキストノード（マークを適用）
 */
function RenderTextNode({ node }: { node: ProseMirrorNode }) {
  if (!node.text) return null;

  let textElement = <>{node.text}</>;

  // マークを適用
  if (node.marks) {
    for (const mark of node.marks) {
      switch (mark.type) {
        case 'bold':
          textElement = <Text className="font-bold">{textElement}</Text>;
          break;
        case 'italic':
          textElement = <Text className="italic">{textElement}</Text>;
          break;
        case 'underline':
          textElement = <Text className="underline">{textElement}</Text>;
          break;
        case 'strike':
          textElement = <Text className="line-through">{textElement}</Text>;
          break;
        case 'code':
          textElement = (
            <Text className="font-mono bg-muted dark:bg-dark-muted px-1 rounded">
              {textElement}
            </Text>
          );
          break;
        case 'link':
          // リンクは現時点ではテキストとして表示（将来的にはLinkingで開く）
          textElement = (
            <Text className="text-primary underline">{textElement}</Text>
          );
          break;
      }
    }
  }

  return textElement;
}
