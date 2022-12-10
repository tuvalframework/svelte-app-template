/**
 * Babel will compile modern JavaScript down to a format compatible with older browsers, but it will also increase your
 * final bundle size and build speed. Edit the `browserslist` property in the package.json file to define which
 * browsers Babel should target.
 *
 * Browserslist documentation: https://github.com/browserslist/browserslist#browserslist-
 */
const useBabel = true;

/**
 * This option controls whether or not development builds should be compiled with Babel. Change this to `true` if you
 * intend to test with older browsers during development, but it could significantly impact your build speed.
 */
const useBabelInDevelopment = false;

/**
 * Define paths to any stylesheets you wish to include at the top of the CSS bundle. Any styles compiled from svelte
 * will be added to the bundle after these. In other words, these are global styles for your svelte app. You can also
 * specify paths to SCSS or SASS files, and they will be compiled automatically.
 */
const stylesheets = [
	'./src/styles/index.scss'
];

/**
 * Change this to `true` to generate source maps alongside your production bundle. This is useful for debugging, but
 * will increase total bundle size and expose your source code.
 */
const sourceMapsInProduction = false;

/**
 * Change this to `true` to run svelte-check during hot reloads. This will impact build speeds but will show more
 * thorough errors and warnings.
 */
const svelteCheckInDevelopment = false;

/**
 * Change this to `false` to disable svelte-check during production builds. Build speeds will be faster, but error
 * and warning checks will be less thorough.
 */
const svelteCheckInProduction = false;

/*********************************************************************************************************************/
/**********                                             Webpack                                             **********/
/*********************************************************************************************************************/

import Webpack from 'webpack';
import WebpackDev from 'webpack-dev-server';
import SveltePreprocess from 'svelte-preprocess';
import Autoprefixer from 'autoprefixer';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CSSMinimizerPlugin from 'css-minimizer-webpack-plugin';
import SvelteCheckPlugin from 'svelte-check-plugin';

import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import fs from 'fs';
import path from 'path';

const manifest = require('./src/manifest');

const mode = process.env.NODE_ENV ?? 'development';
const isProduction = false;
const isDevelopment = !isProduction;

const config: Configuration = {
	mode: 'development',
    devtool: 'source-map',
	entry: {
		bundle: [
			...stylesheets,
			'./src/main.ts'
		]
	},
	externals: {
        '@tuval/core': 'tuval$core',
        '@tuval/cg': 'tuval$core$graphics',
        '@tuval/graphics': 'tuval$graphics',
        '@tuval/gui': 'tuval$gui',
        '@tuval/forms': 'tuval$forms',
        '@tuval/components/buttons': 'tuval$components$buttons',
        '@tuval/components/calendars': 'tuval$components$calendars',
        '@tuval/components/charts': 'tuval$components$charts',
        '@tuval/components/compression': 'tuval$components$compression',
        '@tuval/components/core': 'tuval$components$core',
        '@tuval/components/data': 'tuval$components$data',
        '@tuval/components/diagram': 'tuval$components$diagram',
        '@tuval/components/dropdowns': 'tuval$components$dropdowns',
        '@tuval/components/excelexport': 'tuval$components$excelexport',
        '@tuval/components/filemanager': 'tuval$components$filemanager',
        '@tuval/components/fileutils': 'tuval$components$fileutils',
        '@tuval/components/grids': 'tuval$components$grids',
        '@tuval/components/inputs': 'tuval$components$inputs',
        '@tuval/components/layouts': 'tuval$components$layouts',
        '@tuval/components/lists': 'tuval$components$lists',
        '@tuval/components/navigations': 'tuval$components$navigations',
        '@tuval/components/pdfexport': 'tuval$components$pdfexport',
        '@tuval/components/popups': 'tuval$components$popups',
        '@tuval/components/splitbuttons': 'tuval$components$splitbuttons',
        '@tuval/components/svgbase': 'tuval$components$svgbase',
        '@tuval/components/query-builder': 'tuval$components$query-builder',
        '@tuval/components/spreadsheet': 'tuval$components$spreadsheet'
    },
	resolve: {
		alias: {
			// Note: Later in this config file, we'll automatically add paths from `tsconfig.compilerOptions.paths`
			svelte: path.resolve('node_modules', 'svelte')
		},
		fallback: {
            child_process: false,
            fs: false,
            crypto: false,
            net: false,
            tls: false,
            ws: false,
            os: false,
            path: false
        },
		extensions: ['.mjs', '.js', '.ts','.tsx', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main']
	},
	output: {
		libraryTarget: 'umd',
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist')
	},
	module: {
		rules: [
			// Rule: Svelte
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							// Dev mode must be enabled for HMR to work!
							dev: isDevelopment
						},
						emitCss: isProduction,
						hotReload: isDevelopment,
						hotOptions: {
							// List of options and defaults: https://www.npmjs.com/package/svelte-loader-hot#usage
							noPreserveState: false,
							optimistic: true,
						},
						preprocess: SveltePreprocess({
							scss: true,
							sass: true,
							postcss: {
								plugins: [
									Autoprefixer
								]
							}
						})
					}
				}
			},

			// Required to prevent errors from Svelte on Webpack 5+, omit on Webpack 4
			// See: https://github.com/sveltejs/svelte-loader#usage
			{
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			},

			// Rule: SASS
			{
				test: /\.(scss|sass)$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									Autoprefixer
								]
							}
						}
					},
					'sass-loader'
				]
			},

			// Rule: CSS
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					'css-loader',
				]
			},

			// Rule: TypeScript
			{
				test: /\.(ts|tsx)$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	devServer: {
		hot: true,
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css'
		}),

		{
            apply: (compiler) => {
                compiler.hooks.afterEmit.tap('AfterEmitPlugin', (compilation) => {
                    const file = './dist/index.js';
                    var data = fs.readFileSync(file); //read existing contents into data
                    //var fd = fs.openSync(file, 'w+');
                    var buffer = new Buffer('');
                    fs.writeFileSync(file, buffer);
                    fs.appendFileSync(file, data);

                    var bufferEnd = new Buffer(`
                tuval$core.ModuleLoader.FireModuleLoadedEvent('${manifest.application.name}', tuval$core['__APPS__']['${manifest.application.name}']);
                `);
                    fs.appendFileSync(file, bufferEnd);
                    /*  fs.appendFile('./dist/index.js', `
        tuval$core.ModuleLoader.FireModuleLoadedEvent('${manifest.application.name}', tuval$core['__APPS__']['${manifest.application.name}']);
`, (err) => {
        if (err) throw err;
        console.log('The lyrics were updated!');
    }); */
                });
            }
        }
	]
};

/**
 * This interface combines configuration from `webpack` and `webpack-dev-server`. You can add or override properties
 * in this interface to change the config object type used above.
 */
export interface Configuration extends Webpack.Configuration, WebpackDev.Configuration {

}

/*********************************************************************************************************************/
/**********                                             Advanced                                            **********/
/*********************************************************************************************************************/

// Configuration for production bundles
if (isProduction) {
	// Clean the build directory for production builds
	config.plugins?.push(new CleanWebpackPlugin());

	// Minify CSS files
	config.optimization?.minimizer?.push(
		new CSSMinimizerPlugin({
			parallel: true,
			minimizerOptions: {
				preset: [
					'default',
					{
						discardComments: { removeAll: !sourceMapsInProduction },
					},
				],
			},
		})
	);

	// Minify and treeshake JS
	if (config.optimization === undefined) {
		config.optimization = {};
	}

	config.optimization.minimize = true;
}

// Parse as JSON5 to add support for comments in tsconfig.json parsing.
require('require-json5').replace();

// Load path aliases from the tsconfig.json file
const tsconfigPath = path.resolve(__dirname, 'tsconfig.json');
const tsconfig = fs.existsSync(tsconfigPath) ? require(tsconfigPath) : {};

if ('compilerOptions' in tsconfig && 'paths' in tsconfig.compilerOptions) {
	const aliases = tsconfig.compilerOptions.paths;

	for (const alias in aliases) {
		const paths = aliases[alias].map((p: string) => path.resolve(__dirname, p));

		// Our tsconfig uses glob path formats, whereas webpack just wants directories
		// We'll need to transform the glob format into a format acceptable to webpack

		const wpAlias = alias.replace(/(\\|\/)\*$/, '');
		const wpPaths = paths.map((p: string) => p.replace(/(\\|\/)\*$/, ''));

		if (config.resolve && config.resolve.alias) {
			if (!(wpAlias in config.resolve.alias) && wpPaths.length) {
				config.resolve.alias[wpAlias] = wpPaths.length > 1 ? wpPaths : wpPaths[0];
			}
		}
	}
}

// Babel
if (useBabel && (isProduction || useBabelInDevelopment)) {
	const loader = {
		loader: 'babel-loader',
		options: {
			sourceType: 'unambiguous',
			presets: [
				[
					// Docs: https://babeljs.io/docs/en/babel-preset-env
					'@babel/preset-env',
					{
						debug: false,
						corejs: { version: 3 },
						useBuiltIns: 'usage'
					}
				]
			],
			plugins: ['@babel/plugin-transform-runtime']
		}
	};

	config.module?.rules.unshift({
		test: /\.(?:m?js|ts)$/,
		include: [
			path.resolve(__dirname, 'src'),
			path.resolve('node_modules', 'svelte')
		],
		exclude: [
			/node_modules[/\\](css-loader|core-js|webpack|regenerator-runtime)/
		],
		use: loader,
	});

	const svelte = config.module?.rules.find(rule => {
		if (typeof rule !== 'object') return false;
		else if (Array.isArray(rule.use))
			return rule.use.includes((e: any) => typeof e.loader === 'string' && e.loader.startsWith('svelte-loader'));
		else if (typeof rule.use === 'object')
			return rule.use.loader?.startsWith('svelte-loader') ?? false;
		return false;
	}) as Webpack.RuleSetRule;

	if (!svelte) {
		console.error('ERR: Could not find svelte-loader for babel injection!');
		process.exit(1);
	}

	if (!Array.isArray(svelte.use)) {
		svelte.use = [svelte.use as any];
	}

	svelte.use.unshift(loader);
}

export default config;
