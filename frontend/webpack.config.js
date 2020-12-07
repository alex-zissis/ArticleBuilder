const {resolve} = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
    const mode = env && env.production ? 'production' : 'development';
    const htmlTemplate = `./src/index.html`;

    return {
        mode,
        devtool: 'source-map',
        plugins: [
            new HtmlWebpackPlugin({
                template: htmlTemplate,
            }),
        ],
        resolve: {
            modules: ['src', 'node_modules'],
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.scss'],
        },
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: resolve(__dirname, 'src'),
                    loader: 'babel-loader',
                },
                {
                    enforce: 'pre',
                    include: resolve(__dirname, 'src'),
                    test: /\.js$/,
                    loader: 'source-map-loader',
                },
                {
                    test: /\.s[ac]ss$/i,
                    include: resolve(__dirname, 'src'),
                    use: ['style-loader', 'css-loader', 'sass-loader'],
                },
            ],
        },
        output: {
            path: __dirname + '/dist',
            publicPath: '/',
        },
        devServer: {
            compress: true,
            historyApiFallback: true,
            port: 9000,
            publicPath: '/',
            contentBase: resolve(__dirname, './dist'),
        },
    };
};
