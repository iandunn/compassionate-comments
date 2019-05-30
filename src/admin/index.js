/**
 * WordPress dependencies
 */
import { render, createElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MainController as CompassionateCommentsAdmin } from './main/controller';

( function() {
	/**
	 * Initialize the app.
	 */
	function init() {
		const container = document.getElementById( 'compassionate-comments-settings' );
		const props     = { ...comconOptions };

		render(
			createElement( CompassionateCommentsAdmin, props ),
			container
		);
	}

	init();
}() );
