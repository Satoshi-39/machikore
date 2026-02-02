module.exports = {
  expo: {
    name: '街コレ',
    slug: 'machikore',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/machikore13.png',
    scheme: 'machikore',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.tyatsushi.machikore',
      appleTeamId: '9KT9GSG58F',
      deploymentTarget: '15.1',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription: 'このアプリでは、現在地を地図に表示したり、近くのスポットを登録するために位置情報を使用します。',
        // 多言語対応後に追加: 'en', 'zh-Hans', 'zh-Hant'
        CFBundleLocalizations: ['ja'],
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
      },
    },
    android: {
      package: 'com.tyatsushi.machikore',
      minSdkVersion: 24, // Android 7.0 以降
      adaptiveIcon: {
        backgroundColor: '#E6F4FE',
        foregroundImage: './assets/images/android-icon-foreground.png',
        backgroundImage: './assets/images/android-icon-background.png',
        monochromeImage: './assets/images/android-icon-monochrome.png',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_ANDROID_API_KEY,
        },
      },
    },
    web: {
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      [
        '@sentry/react-native/expo',
        {
          organization: '68f07d35e635',
          project: 'react-native',
        },
      ],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID || 'ca-app-pub-3940256099942544~3347511713',
          iosAppId: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511',
          delayAppMeasurementInit: true,
          userTrackingUsageDescription: 'あなたの興味に合った広告を表示するために、トラッキングデータを使用します。',
        },
      ],
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/machikore7.png',
          imageWidth: 150,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      [
        'expo-image-picker',
        {
          cameraPermission: 'スポットの写真を撮影するためにカメラを使用します。',
          photosPermission: 'スポットに写真を追加するためにフォトライブラリにアクセスします。',
        },
      ],
      '@rnmapbox/maps',
      'expo-localization',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'cb48ad39-0471-44b4-9c61-30e75c8339aa',
      },
      // 環境変数をビルドに埋め込む（Release ビルドでも利用可能）
      EXPO_PUBLIC_SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL,
      EXPO_PUBLIC_SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
      EXPO_PUBLIC_ENV: process.env.EXPO_PUBLIC_ENV,
      EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
      EXPO_PUBLIC_MAPBOX_STYLE_URL: process.env.EXPO_PUBLIC_MAPBOX_STYLE_URL,
      EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID,
      EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_OAUTH_ANDROID_CLIENT_ID,
      EXPO_PUBLIC_REVENUECAT_API_KEY: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY,
      EXPO_PUBLIC_POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
      EXPO_PUBLIC_POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,
      EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
      EXPO_PUBLIC_ADMOB_IOS_APP_ID: process.env.EXPO_PUBLIC_ADMOB_IOS_APP_ID,
      EXPO_PUBLIC_ADMOB_ANDROID_APP_ID: process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_ID,
      EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_IOS: process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_IOS,
      EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_ANDROID: process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID_ANDROID,
      EXPO_PUBLIC_ADMOB_NATIVE_UNIT_ID_IOS: process.env.EXPO_PUBLIC_ADMOB_NATIVE_UNIT_ID_IOS,
      EXPO_PUBLIC_ADMOB_NATIVE_UNIT_ID_ANDROID: process.env.EXPO_PUBLIC_ADMOB_NATIVE_UNIT_ID_ANDROID,
    },
  },
};
