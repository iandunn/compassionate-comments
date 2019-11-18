/**
 * WordPress dependencies
 */
import { render, createElement } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { Admin as CompassionateCommentsAdmin } from './main/controller';
import './admin.scss';

/* global comconOptions:false */


( function() {
	/**
	 * Initialize the app.
	 */
	function init() {
		const container = document.getElementById( 'comcon-admin' );
		const props     = { ...comconOptions };

		render(
			createElement( CompassionateCommentsAdmin, props ),
			container
		);
	}

	init();
}() );
