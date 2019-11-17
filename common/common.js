/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';


/**
 * Send a request to the Perspective API to analyse a comment.
 *
 * This uses `fetch()` directly instead of `apifetch()`, because the latter is only intended for interacting
 * with WP REST API endpoints, and there are lots of difficulties making it work with arbitrary APIs.
 *
 * See https://github.com/WordPress/gutenberg/pull/15900#issuecomment-497139968.
 *
 * @param {string} apiKey
 * @param {string} commentText
 * @param {string} doNotStore  If true, we'll ask the Perspective API to _not_ save the comment for their own research.
 *
 * @return {object} Either the API response object, or an object with an `error` key.
 */
export async function sendScoreRequest( apiKey, commentText, doNotStore ) {
	let results;

	/*
	 * The `languages` parameter is intentionally _not_ set, because we have no way of knowing what language
	 * the comment is written in. On many sites it could easily be a different language than `get_locate()`.
	 * Perspective will automatically detect the language when an explicit value isn't passed.
	 */
	const data = {
		comment : {
			text : commentText,
				// todo probably use wp.util.sanitize() to strip html tags?,
				// not a security issue, but api might not expect to see html and might distort the score

				// also limit is 3k, truncate to that if larger.
					// probably need to consider multibyte chars
		},

		requestedAttributes : { TOXICITY: {} },
		doNotStore
	};

	/*
	 * Exposing the key to visitors in the browser like this isn't ideal, but the alternative is to proxy the
	 * request through a REST API endpoint on the server, which would be much slower, and add extra
	 * code/complexity. To mitigate the risk, a strong warning is shown on the Settings screen, asking the
	 * admin to restrict the key to their server.
	 *
	 * todo this is wrong, key restrictions wont work, because the request comes from the browser. won't know
	 * ip, and referrer can be spoofed. restricting to perspective api only helps, but ideally have to proxy
	 * request through local rest api so that server is making the request rather than client :(
	 */
	const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${ apiKey }`;

	const requestParams = {
		method      : 'POST',
		body        : JSON.stringify( data ),
		headers     : new Headers( { 'Content-Type': 'application/json' } ),
		credentials : 'omit',
	};

	try {
		const response = await fetch( url, requestParams );
		results        = await response.json();

	} catch( error ) {
		// This matches the format returned by the API for application-layer errors (e.g., invalid API key).
		results = { error };

	} finally {
		if ( results.error ) {
			consoleError( results.error );
		}
	}

	return results;
}

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

/**
 * Safely extract an error message from a variety of inputs.
 *
 * @param {mixed} error
 *
 * @return {string}
 */
export function getErrorMessage( error ) {
	let message;

	if ( 'string' === typeof error ) {
		message = error;
	} else if ( 'object' === typeof error && error.hasOwnProperty( 'message' ) ) {
		message = error.message;
	} else {
		message = JSON.stringify( error );
	}

	return message;
}
