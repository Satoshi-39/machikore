/**
 * Instagram埋め込みコンポーネント
 *
 * instagram.com/p/{id}/embed/ のiframe方式で表示
 * WebViewの高さはpostMessageで動的に調整
 */

import { useState, useCallback } from 'react';
import { View, Text, Pressable, useWindowDimensions, Linking } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

interface InstagramEmbedProps {
  embedId: string;
  url: string | undefined;
}

export function InstagramEmbed({ embedId, url }: InstagramEmbedProps) {
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
        <Text className="text-sm text-on-surface-variant">Instagramのコンテンツを表示</Text>
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
          // Instagram embedの読み込み完了を待って高さを送信
          window.onload = function() {
            setTimeout(sendHeight, 500);
            setTimeout(sendHeight, 1500);
            setTimeout(sendHeight, 3000);
            setTimeout(sendHeight, 5000);
          };
          // iframeのloadイベントでも高さを送信
          var iframe = document.querySelector('iframe');
          if (iframe) {
            iframe.onload = function() {
              setTimeout(sendHeight, 500);
              setTimeout(sendHeight, 1500);
            };
          }
          // MutationObserverで動的な変更を監視
          var observer = new MutationObserver(sendHeight);
          observer.observe(document.body, { childList: true, subtree: true, attributes: true });
          // window.messageイベントでinstagram embedからのリサイズを検知
          window.addEventListener('message', function(e) {
            if (e.data && typeof e.data === 'string') {
              try {
                var msg = JSON.parse(e.data);
                if (msg.type === 'MEASURE' && msg.details && msg.details.height) {
                  var iframe = document.querySelector('iframe');
                  if (iframe) {
                    iframe.style.height = msg.details.height + 'px';
                  }
                  setTimeout(sendHeight, 100);
                }
              } catch(ex) {}
            }
            // 常に高さを再送信
            setTimeout(sendHeight, 200);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <View className="mb-4 items-center">
      <View style={{ width: contentWidth, height: webViewHeight, borderRadius: 12, overflow: 'hidden' }}>
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
