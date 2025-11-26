module.exports = {
  expo: {
    name: '街コレ',
    slug: 'machikore',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/machikore.png',
    scheme: 'machikore',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.tyatsushi.machikore',
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSLocationWhenInUseUsageDescription: 'このアプリでは、現在地を地図に表示したり、近くのスポットを登録するために位置情報を使用します。',
      },
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_IOS_API_KEY,
      },
    },
    android: {
      package: 'com.tyatsushi.machikore',
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
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
          dark: {
            backgroundColor: '#000000',
          },
        },
      ],
      '@rnmapbox/maps',
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
    },
  },
};
