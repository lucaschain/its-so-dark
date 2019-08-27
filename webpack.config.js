const path = require('path');

const presets = [
  [
    "@babel/env",
    {
      targets: {
        edge: "17",
        firefox: "60",
        chrome: "67",
        safari: "11.1",
      },
      useBuiltIns: "usage",
    },
  ],
	"@babel/flow"
];

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  watch: false,
  watchOptions: {
    ignored: ['dist', 'node_modules']
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets
          }
        }
      }
    ]
  }
};
