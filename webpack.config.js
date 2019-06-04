/**
 * External dependencies
 */
const path = require( 'path' );

/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );


module.exports = {
	...defaultConfig,

	entry : {
		'admin'     : './admin/index',
		'front-end' : './front-end/index',

		// todo is this needed? if so, open an issue b/c wp-scripts should detect this common pattern and support it without needing custom config
		// just need to establish a convention for naming admin/front-end
		// or maybe even just auto-define based on folder names - that'd probably be better
		// or cli params?
	},

	output : {
		filename : '[name].js',

		/*
		 * @todo Move to package.json.scripts{} when possible
		 *
		 * See https://github.com/WordPress/gutenberg/issues/14891.
		 */
		path : path.resolve( __dirname, 'build' ),
	},
};
