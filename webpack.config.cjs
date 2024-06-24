const path = require('path')
const webpack = require('webpack')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const bundleConfig = (mode) => ({

        entry: {
            'binpacket': path.join(process.cwd(), 'src', 'umd.ts'),
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

                mocha: false,
                path: false,
                fs: false,
                stream: false,
                buffer: false
    
            },
    
        },
    
    })

module.exports = [bundleConfig('development'), bundleConfig('production')]