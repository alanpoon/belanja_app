module.exports = function(api) {
  api.cache(true);
  console.log("hi");
  return {
    presets: ['babel-preset-expo', "module:react-native-dotenv"],
    "plugins": [
      ["babel-plugin-rewrite-require", {
        "aliases": {
          "@plugnet":"@polkadot/api"
      }}],["transform-rename-import", { original: '@plugnet/types', replacement: '@polkadot/types' }]
      //,      ["bundled-import-meta"],["@babel/plugin-syntax-import-meta"]
    ],
    env: {
      development: {
      "plugins": [
        ["babel-plugin-rewrite-require", {
          "aliases": {
            "@plugnet":"@polkadot/api"
        }}],["transform-rename-import", { original: 'plugnet/types', replacement: 'polkadot/types' }]
      ]
    }
  }
  };
};
