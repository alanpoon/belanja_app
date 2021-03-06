module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', "module:react-native-dotenv"],
    env: {
      development: {
      "plugins": [
        ["babel-plugin-rewrite-require", {
          "aliases": {
            "crypto": "expo-crypto"
          }
        }]
      ]
    }
  }
  };
};
