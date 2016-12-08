let path = require('path'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack');

let options = {
    entry: ['./src/app.js', './src/custom-css.css'],
    output: {
        path: './public',
        filename: 'app.min.js'
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader") },
            {test: /\.js$/, exclude: /node_modules/, loader:'babel-loader', query:{presets:['es2015']} }
        ]
    },
    plugins: [
        /* minification of dist js file */
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        /* minification of html files and keeping minified files in dist folder */
        new HtmlWebpackPlugin({
            template: 'src/index.html', //Input
            filename: 'index.html', //Output
            inject: false,
            minify: {
                caseSensitive: true,
                collapseWhitespace: true,
                conservativeCollapse: true,
                removeComments: true
            }
        }),
        /* extract the css file from source to dist folder */
        new ExtractTextPlugin('custom-css.min.css'),
        /* Optimization after extraction in destination folder */
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessorOptions: { discardComments: { removeAll: true } },
            canPrint: true
        }),
        /**Copy json file from src to public folder */
        new CopyWebpackPlugin([{from: path.join(__dirname, './src/data.json'), to: path.join(__dirname, './public')}])
    ]
};



//export webpack options
module.exports = options;