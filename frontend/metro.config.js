const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure the root node_modules are searched so that babel plugins
// (reanimated, nativewind) are resolvable from Metro's nested @babel/core.
config.resolver = config.resolver ?? {};
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  'react-native-worklets': path.resolve(__dirname, 'node_modules/react-native-worklets'),
  'react-native-reanimated': path.resolve(__dirname, 'node_modules/react-native-reanimated'),
};

module.exports = withNativeWind(config, { input: './global.css' });
