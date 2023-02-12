const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.s?[ac]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 2 },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['postcss-preset-env'],
              },
            },
          },
          {
            loader: 'sass-loader',
            options: { implementation: require('sass') },
          },
        ],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  externals: {
    'ical.js': 'ICAL',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name]-[contenthash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash].css',
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    compress: true,
  },
  optimization: {
    minimize: true,
    minimizer: ['...', new CssMinimizerWebpackPlugin()],
    splitChunks: { chunks: 'all' },
  },
};
