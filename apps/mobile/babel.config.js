module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src',
            '@assets': './assets',
            '@editor-web': './editor-web',
            'map-memory-manager': './modules/map-memory-manager',
          },
        },
      ],
    ],
  };
};
