// @flow
const path = require('path');
const CssBlocks = require("@css-blocks/jsx");
const CssBlocksPlugin = require("@css-blocks/webpack").CssBlocksPlugin;

const jsxCompilationOptions = {
  compilationOptions: {},
  optimization: {
    rewriteIdents: true,
    mergeDeclarations: true,
    removeUnusedStyles: true,
    conflictResolution: true,
    enabled: true,
  },
  aliases: {}
};

const CssBlockRewriter = new CssBlocks.Rewriter();
const CssBlockAnalyzer = new CssBlocks.Analyzer('src/index.js', jsxCompilationOptions);

module.exports =  {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
  },
  plugins: [
    new CssBlocksPlugin({
      name: "css-blocks",
      outputCssFile: "my-output-file.css",
      analyzer: CssBlockAnalyzer,
      compilationOptions: jsxCompilationOptions.compilationOptions,
      optimization: jsxCompilationOptions.optimization
    }),
  ],
  module: {
    rules: [
      {
        test: /\.[j|t]s(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              compact: true,
            }
          },
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                require("@css-blocks/jsx/dist/src/transformer/babel").makePlugin({ rewriter: CssBlockRewriter }),
              ],
              cacheDirectory: false,
              compact: true
            },
          },
          {
            loader: require.resolve("@css-blocks/webpack/dist/src/loader"),
            options: {
              analyzer: CssBlockAnalyzer,
              rewriter: CssBlockRewriter
            }
          },
        ]
      }
    ]
  }
};
