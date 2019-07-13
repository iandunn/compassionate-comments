/**
 * WordPress dependencies
 */
import { render, createElement } from '@wordpress/element';
import { __ }                    from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { MainController as CompassionateComments } from './main/controller';
import { consoleError }                            from '../common/common';

( function() {
	/**
	 * Initialize the app.
	 */
	function init() {
		const container   = document.createElement( 'div' );
		const commentForm = document.getElementById( 'commentform' );

		const props = {
			commentForm,
			...comconOptions,
		};

		// This isn't a post, or the post doesn't have comments enabled.
		if ( ! commentForm ) {
			return;
		}

		if ( ! props.perspectiveApiKey ) {
			consoleError( __( 'Missing key for Perspective API. Please visit the settings screen to enter it.', 'compassionate-comments' ) );
			return;
		}

		/*
		 * The container won't actually be used by anything, since the view is wrapped in a Modal, which creates
		 * its own container.
		 *
		 * See https://github.com/WordPress/gutenberg/issues/15875.
		 */
		document.getElementsByTagName( 'body' )[ 0 ].appendChild( container );
		renderApp( container, props );
	}

	/**
	 * Render the app.
	 *
	 * @param {Element} container
	 * @param {Array}   props
	 */
	function renderApp( container, props ) {
		render(
			createElement( CompassionateComments, props ),
			// todo need createElement here, or just <CompassionateComments ...props> ?
			// probably just do ^
			// do in admin too
			container
		);
	}

	init();
}() );
