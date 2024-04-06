module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          tests: ['./tests/'],
          '@components': './src/components',
          '@assets': './src/assets',
          '@navigations': './src/navigations',
          '@networking': './src/networking',
          '@screens': './src/screens',
          '@store': './src/store',
          '@theme': './src/theme',
          '@utils': './src/utils',
          '@contexts': './src/contexts',
          '@interfaces': './src/interfaces',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
