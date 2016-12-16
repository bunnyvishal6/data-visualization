let webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    path = require('path');

module.exports = {
    entry: ['./src/app.jsx', './src/custom-scss.scss'],
    module: {
        loaders: [
            { test: /\.scss$/, loader: ExtractTextPlugin.extract("style", "css!postcss!sass") },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
                }
            }
        ]
    },
    output: {
        path: path.join(__dirname, './public'),
        filename: 'bundle.min.js'
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        /**for jquery to be available in global scope */
        new webpack.ProvidePlugin({$: "jquery", jQuery: "jquery"}),
        //Uncomment below these for production build.

        //new webpack.DefinePlugin({'process.env': {NODE_ENV: JSON.stringify('production')}}),
        //new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),

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
    ]
}