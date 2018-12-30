const { resolve } = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
    entry: [
        './app.js',
        './styles/main.scss'
    ],
    mode: 'production',
    output: {
        path: __dirname,
        filename: './public/bundle.js'
    },
    node: {
        fs: 'empty',
    },
    context: __dirname,
    module: {
        rules: [
            {
                query: {
                    presets: ['react', 'es2017', 'stage-3'],
                    compact: false
                },
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            },
            {
                test: /\.(eot|otf|ttf|woff|woff2)$/,
                loader: 'file-loader?name=/public/fonts/[name].[ext]'
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                loader: 'file-loader?name=/public/images/[name].[ext]'
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                include: [
                    resolve(__dirname, "not_exist_path")
                ],
                loader: 'style-loader!css-loader'
            },
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: './public/styles/bundle.css',
            allChunks: true,
        })
    ],
    resolve: {
        alias: {
            componentDir: resolve(__dirname, 'components/'),
            actions: resolve(__dirname, 'actions/index/'),
            configureStore: resolve(__dirname, 'store/configureStore/')
        },
        extensions: ['.js', '.jsx']
    }
};

module.exports = config;
