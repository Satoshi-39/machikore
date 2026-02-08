/**
 * Instagram埋め込みコンポーネント
 *
 * instagram.com/p/{id}/embed/ のiframe方式で表示
 * WebViewの高さはpostMessageで動的に調整
 */

import { useState, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions, Linking } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { borderRadiusNum } from '@/shared/config';
import { useI18n } from '@/shared/lib/i18n';

interface InstagramEmbedProps {
  embedId: string;
  url: string | undefined;
}

export function InstagramEmbed({ embedId, url }: InstagramEmbedProps) {
  const { t } = useI18n();
  const { width: screenWidth } = useWindowDimensions();
  const contentWidth = Math.min(screenWidth - 32, 540); // Instagramの最大幅は540px
  const [webViewHeight, setWebViewHeight] = useState(500);
  const [error, setError] = useState(false);

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

  if (error) {
    return (
      <Pressable
        onPress={() => url && Linking.openURL(url)}
        className="mb-4 p-4 bg-secondary rounded-lg"
      >
        <Text className="text-sm text-on-surface-variant">{t('embed.viewInstagram')}</Text>
        <Text className="text-xs text-primary mt-1">{url}</Text>
      </Pressable>
    );
  }

  // instagram.com/p/{id}/embed/ のiframeを使って表示
  const embedUrl = `https://www.instagram.com/p/${embedId}/embed/`;

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
          iframe {
            width: 100%;
            border: none;
          }
        </style>
      </head>
      <body>
        <iframe
          src="${embedUrl}"
          allowtransparency="true"
          scrolling="no"
          frameborder="0"
          style="width: 100%; min-height: 400px;"
        ></iframe>
        <script>
          function sendHeight() {
            var iframe = document.querySelector('iframe');
            if (iframe) {
              // iframeのcontentWindowにアクセスできない（cross-origin）ため、
              // iframeのclientHeightまたはbody全体の高さを使用
              var height = Math.max(
                document.body.scrollHeight,
                iframe.clientHeight || 0
              );
              if (height > 0) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'resize', height: height }));
              }
            }
          }
          // MutationObserverで動的な変更を監視（主要な検知手段）
          var observer = new MutationObserver(sendHeight);
          observer.observe(document.body, { childList: true, subtree: true, attributes: true });
          // iframeのloadイベントで高さを送信
          var iframe = document.querySelector('iframe');
          if (iframe) {
            iframe.onload = function() { sendHeight(); };
          }
          // Instagram embedからのMEASUREメッセージでリサイズを検知
          window.addEventListener('message', function(e) {
            if (e.data && typeof e.data === 'string') {
              try {
                var msg = JSON.parse(e.data);
                if (msg.type === 'MEASURE' && msg.details && msg.details.height) {
                  var iframe = document.querySelector('iframe');
                  if (iframe) {
                    iframe.style.height = msg.details.height + 'px';
                  }
                }
              } catch(ex) {}
            }
            sendHeight();
          });
          // 安全策: 上記イベントが発火しなかった場合のフォールバック
          setTimeout(sendHeight, 3000);
        </script>
      </body>
    </html>
  `;

  return (
    <View className="mb-4 items-center">
      <View style={{ width: contentWidth, height: webViewHeight, borderRadius: borderRadiusNum.lg, overflow: 'hidden' }}>
        <WebView
          source={{ html }}
          style={{ flex: 1, backgroundColor: 'transparent' }}
          javaScriptEnabled
          scrollEnabled={false}
          onMessage={handleMessage}
          onError={() => setError(true)}
          originWhitelist={['*']}
        />
      </View>
    </View>
  );
}
