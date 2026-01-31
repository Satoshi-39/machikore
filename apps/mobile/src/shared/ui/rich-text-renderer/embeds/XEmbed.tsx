/**
 * X（旧Twitter）埋め込みコンポーネント
 *
 * oEmbed APIを使用してツイートを表示
 */

import { useState, useEffect, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions, Linking, ActivityIndicator } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { fetchTwitterOEmbed } from '@/shared/lib/embed';

interface XEmbedProps {
  url: string | undefined;
}

export function XEmbed({ url }: XEmbedProps) {
  const { width: screenWidth } = useWindowDimensions();
  const [embedHtml, setEmbedHtml] = useState<string | null>(null);
  const [webViewHeight, setWebViewHeight] = useState(300);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const contentWidth = screenWidth - 32;

  // oEmbed APIからHTMLを取得
  useEffect(() => {
    if (!url) {
      setError(true);
      setIsLoading(false);
      return;
    }

    fetchTwitterOEmbed(url)
      .then((data) => {
        if (data?.html) {
          setEmbedHtml(data.html);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  }, [url]);

  // WebViewからの高さ変更メッセージを処理
  const handleMessage = useCallback((event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'resize' && data.height) {
        setWebViewHeight(data.height);
      }
    } catch {
      // ignore
    }
  }, []);

  if (isLoading) {
    return (
      <View className="mb-4 p-4 bg-secondary rounded-lg items-center justify-center" style={{ height: 100 }}>
        <ActivityIndicator size="small" />
        <Text className="text-xs text-on-surface-variant mt-2">ツイートを読み込み中...</Text>
      </View>
    );
  }

  if (error || !embedHtml) {
    return (
      <Pressable
        onPress={() => url && Linking.openURL(url)}
        className="mb-4 p-4 bg-secondary rounded-lg"
      >
        <Text className="text-sm text-on-surface-variant">Xのコンテンツを表示</Text>
        <Text className="text-xs text-primary mt-1">{url}</Text>
      </Pressable>
    );
  }

  // Twitter widgets.jsを使って動的にレンダリング
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          html, body {
            background: transparent;
            overflow: hidden;
          }
          .twitter-tweet {
            margin: 0 !important;
          }
        </style>
      </head>
      <body>
        ${embedHtml}
        <script src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        <script>
          function sendHeight() {
            const height = document.body.scrollHeight;
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'resize', height: height }));
          }
          // MutationObserverで動的な変更を監視（widgets.jsがDOMを書き換える際に検知）
          const observer = new MutationObserver(sendHeight);
          observer.observe(document.body, { childList: true, subtree: true });
          // widgets.jsのレンダリング完了イベントで高さを送信
          window.onload = function() {
            if (window.twttr && twttr.events) {
              twttr.events.bind('rendered', sendHeight);
            }
          };
          // 安全策: widgets.jsのイベントが発火しなかった場合のフォールバック
          setTimeout(sendHeight, 3000);
        </script>
      </body>
    </html>
  `;

  return (
    <View className="mb-4" style={{ width: contentWidth, height: webViewHeight, borderRadius: 12, overflow: 'hidden' }}>
      <WebView
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        javaScriptEnabled
        scrollEnabled={false}
        onMessage={handleMessage}
        originWhitelist={['*']}
      />
    </View>
  );
}
