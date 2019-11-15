/**
 * External dependencies
 */
const path                 = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );


module.exports = {
	...defaultConfig,

	entry : {
		'admin'     : './admin/index.js',
		'front-end' : './front-end/index.js',

		// todo is this needed? if so, open an issue b/c wp-scripts should detect this common pattern and support it without needing custom config
			// looks like that exists now, see https://github.com/WordPress/gutenberg/pull/15982
		// just need to establish a convention for naming admin/front-end
		// or maybe even just auto-define based on folder names - that'd probably be better
		// or cli params?
	},

	plugins : [
		...defaultConfig.plugins,
		new MiniCssExtractPlugin( {
			filename : '[name].min.css',
		} ),
	],

	/*
	 * Compile SCSS to vanilla CSS.
	 *
	 * @todo Remove this when https://github.com/WordPress/gutenberg/issues/14801 is resolved.
	 */
	module : {
		...defaultConfig.module,

		rules : [
			...defaultConfig.module.rules,
			{
				test    : /\.(sc|sa|c)ss$/,
				exclude : [ /node_modules/ ],
				use     : [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ],
			},
		],
	},

	output : {
		...defaultConfig.output,

		// @todo Can this be done via CLI param instead? If not open an issue for that and add URL here.
		// IIRC there's a G issue/PR for that, and it works now. See wordcamp.org and other projects to check.
		filename : '[name].js',

		/*
		 * @todo Move to package.json.scripts{} when possible
		 *
		 * See https://github.com/WordPress/gutenberg/issues/14891.
		 */
		path : path.resolve( __dirname, 'build' ),
	},
};
