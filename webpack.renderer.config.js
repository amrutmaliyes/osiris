// const rules = require('./webpack.rules');

// rules.push({
//   test: /\.css$/,
//   use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
// });

// module.exports = {
//   // Put your normal webpack config below here
//   module: {
//     rules,
//   },
// };

const rules = require('./webpack.rules');

// Add a new rule for handling image files
rules.push({
  test: /\.(png|jpe?g|gif|svg)$/i, // Matches common image file formats
  type: 'asset/resource', // For Webpack 5+ built-in asset modules
  // Alternatively, for older Webpack versions, you can use `file-loader`:
  // use: [
  //   {
  //     loader: 'file-loader',
  //     options: {
  //       name: '[name].[hash].[ext]',
  //       outputPath: 'assets/',
  //     },
  //   },
  // ],
});

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
  // Put your normal webpack config below here
  module: {
    rules,
  },
};
