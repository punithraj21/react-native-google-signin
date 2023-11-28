const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Use react-native-svg-transformer for SVG files
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg');
defaultConfig.resolver.sourceExts.push('svg');
defaultConfig.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

// Your existing configuration
const config = {};

module.exports = mergeConfig(defaultConfig, config);
