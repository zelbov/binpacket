const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const bundleConfig = (mode) => ({

        entry: {
            binpacket: path.join(process.cwd(), 'src', 'index.ts'),
            'buffer-polyfill': path.join(process.cwd(), 'src', 'polyfills', 'BufferPolyfill.ts')
        },
        output: {
            filename: `[name]${mode != 'production' ? '' : '.min'}.js`,
            path: path.join(process.cwd(), 'umd')
        },
    
        target: 'web',
        mode,
        devtool: mode == 'production' ? 'source-map' : 'inline-source-map',
    
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
    
                ...(mode == 'production' ? [] : [{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" }])
    
            ]
    
        },
    
        externalsPresets: { node: false },
    
        resolve: {
    
            extensions: [ '.js', '.ts' ],
            fullySpecified: false,
            fallback: {
    
                // browser polyfills required for a module to work in browsers
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('binpacket/buffer-polyfill'),
    
                // test-only: external node deps resolved by Karma
                mocha: false,
                path: false,
                fs: false,
                util: require.resolve('util'),
    
            },
    
            // test-only: for projects that have a module installed via npm, providing aliases or path plugins is not required
            plugins: [new TsconfigPathsPlugin()]
    
        },
    
        plugins: [
            
            new webpack.ProvidePlugin({
                process: 'process/browser',
                Buffer: ['buffer', 'Buffer']
            }),
    
        ]
    
    })

module.exports = [bundleConfig('development'), bundleConfig('production')]