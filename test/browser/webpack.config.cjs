const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// karma-webpack is too slow when bundling ESM modules,
// so we will use separate bundling process with require.context driven entrypoint instead
module.exports = {

    entry: path.join(process.cwd(), 'test', 'browser', 'entrypoint.ts'),
    output: {
        filename: 'tests.bundle.js',
        path: path.join(process.cwd(), 'temp')
    },

    target: 'web',
    mode: 'none',
    devtool: 'inline-source-map',

    module: {

        rules: [

            {

                test: /.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            configFile: path.join(process.cwd(), "tsconfig.json"),
                            transpileOnly: true
                        }
                    },
                ]

            },

            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }

        ]

    },

    externalsPresets: { node: false },

    resolve: {

        extensions: [ '.js', '.ts' ],
        fullySpecified: false,
        fallback: {

            // browser polyfills required for a module to work in browsers
            stream: require.resolve('stream-browserify'),
            buffer: require.resolve('buffer'),

            // test-only: external node deps resolved by Karma
            mocha: false,
            path: false,
            fs: false,
            util: require.resolve('util'),
            
            // use UMD package loaded by test runner
            Binpacket: false

        },

        // test-only: for projects that have a module installed via npm, providing aliases or path plugins is not required
        plugins: [new TsconfigPathsPlugin()]

    },

    plugins: [
        
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer'],
            Binpacket: 'Binpacket'
        }),

    ]

}