const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const ModuleReplaceWebpackPlugin = require('module-replace-webpack-plugin');
const path = require("path");
const WasmPackPlugin = require("@wasm-tool/wasm-pack-plugin");

module.exports = async function(env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  // Customize the config before returning it.
  console.log(config.module.defaultRules)
  /*
  config['plugins'].push(
    new ModuleReplaceWebpackPlugin({
      modules: [{
        test: /plugnet\/api/,
        replace: './node_modules/@polkadot/api/index.js'
      },{
        test: /plugnet\/api-metadata/,
        replace: './node_modules/@polkadot/api-metadata/index.js'
      },{
        test: /plugnet\/rpc-core/,
        replace: './node_modules/@polkadot/rpc-core/index.js'
      },{
        test: /plugnet\/rpc-provider/,
        replace: './node_modules/@polkadot/rpc-provider/index.js'
      },{
        test: /plugnet\/rpc-types/,
        replace: './node_modules/@polkadot/rpc-types/index.js'
      }]
    })
  )
  
  config['plugins'].push(
    new WasmPackPlugin({
      crateDirectory: path.resolve(__dirname, "rust_new")})
  )
  */
 console.log(config["devServer"])
 /*
  config["devServer"]={
    "mimeTypes":"application/wasm"
  };*/
  /*
  config['module']['rules'].push({
    type: 'javascript/auto',
    resolve: {}
  })
  config['module']['rules'].push({
    test:  /\.json$/i,
    type: 'json'
  }) 
  config['module']['rules'].push({
    test: /\.js$/,
    loader: require.resolve('@open-wc/webpack-import-meta-loader'),
  })
  
  const wasmExtensionRegExp = /\.wasm$/;

  config.resolve.extensions.push('.wasm');

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        // make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, 'rust','target','wasm32-unknown-unknown','debug'),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }]
  });
  */
 const wasmExtensionRegExp = /\.wasm$/;

  config.resolve.extensions.push('.wasm');

  config.module.rules.forEach(rule => {
    (rule.oneOf || []).forEach(oneOf => {
      if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
        // Make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // Add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname,"s"),
    use: [{ loader: require.resolve('wasm-loader'), options: {} }]
  })
  return config;
};
