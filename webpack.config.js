const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const stylesHandler = 'style-loader';

module.exports = {
    entry: {
        grpc_web_panel: path.resolve(__dirname, "src", "app/grpc_web_panel.tsx"),
        devtools: path.resolve(__dirname, "src", "app/devtools.ts"),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: [stylesHandler, 'css-loader', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        path: path.join(__dirname, "./dist"),
        filename: "[name].js",
    },
    plugins: [
        new CopyPlugin({
            patterns: [{from: ".", to: ".", context: "public"}]
        }),
    ],
};
