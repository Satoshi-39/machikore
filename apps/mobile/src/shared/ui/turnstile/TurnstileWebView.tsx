/**
 * Cloudflare Turnstile CAPTCHA WebView（invisible mode）
 *
 * FSD: shared/ui/turnstile
 *
 * WebViewでTurnstileのinvisibleウィジェットをレンダリングし、
 * forwardRef + useImperativeHandle で execute() メソッドを公開する。
 */

import React, { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import type { ShouldStartLoadRequest } from 'react-native-webview/lib/WebViewTypes';
import { ENV } from '@/shared/config';

export interface TurnstileWebViewRef {
  execute: () => void;
}

interface TurnstileWebViewProps {
  onToken: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
}

const buildHtml = (siteKey: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad" async defer></script>
  <style>
    body { margin: 0; padding: 0; background: transparent; }
  </style>
</head>
<body>
  <div id="turnstile-container"></div>
  <script>
    var widgetId = null;

    function onTurnstileLoad() {
      widgetId = turnstile.render('#turnstile-container', {
        sitekey: '${siteKey}',
        size: 'invisible',
        callback: function(token) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'token', token: token }));
        },
        'error-callback': function(error) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', error: String(error) }));
        },
        'expired-callback': function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'expired' }));
        },
      });
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'ready' }));
    }

    function executeTurnstile() {
      if (widgetId !== null) {
        turnstile.reset(widgetId);
        turnstile.execute(widgetId);
      }
    }
  </script>
</body>
</html>
`;

export const TurnstileWebView = forwardRef<TurnstileWebViewRef, TurnstileWebViewProps>(
  function TurnstileWebView({ onToken, onError, onExpire }, ref) {
    const webViewRef = useRef<WebView>(null);

    useImperativeHandle(ref, () => ({
      execute: () => {
        webViewRef.current?.injectJavaScript('executeTurnstile(); true;');
      },
    }));

    const handleMessage = useCallback(
      (event: WebViewMessageEvent) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);
          switch (data.type) {
            case 'token':
              onToken(data.token);
              break;
            case 'error':
              onError?.(data.error);
              break;
            case 'expired':
              onExpire?.();
              break;
          }
        } catch {
          // ignore parse errors
        }
      },
      [onToken, onError, onExpire]
    );

    const handleShouldStartLoad = useCallback(
      (_request: ShouldStartLoadRequest): boolean => true,
      []
    );

    return (
      <View style={{ height: 1, width: 1, opacity: 0, position: 'absolute' }}>
        <WebView
          ref={webViewRef}
          source={{ html: buildHtml(ENV.TURNSTILE_SITE_KEY), baseUrl: ENV.SUPABASE_URL }}
          onMessage={handleMessage}
          onShouldStartLoadWithRequest={handleShouldStartLoad}
          javaScriptEnabled
          domStorageEnabled
          sharedCookiesEnabled
          thirdPartyCookiesEnabled
          originWhitelist={['*']}
          scrollEnabled={false}
          bounces={false}
          cacheEnabled
        />
      </View>
    );
  }
);
