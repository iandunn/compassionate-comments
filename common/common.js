/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Send an error to the browser console.
 *
 * @param {*} message
 */
export function consoleError( message ) {
	console.error(
		//  Intentionally not including message in the string, because it may be an object, array, etc.
		__( 'Compassionate Comments error:', 'compassionate-comments' ),
		message
	);
}
