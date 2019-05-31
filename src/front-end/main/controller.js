/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ }        from '@wordpress/i18n';
// todo audit ^
// todo change to import

// todo refactor this if not big enouhg for maincont/mainview? or maybe leave so room to grow?

// todo go through every line in file and audit

/**
 * Internal dependencies
 */
import { MainView } from './view';

/**
 * Manage the state for the main interface.
 */
export class MainController extends Component {
	constructor( props ) {
		super( props );

		this.state = {
			error         : false,
			interfaceOpen : false,
			// todo rename ^ ?
			loading       : false,
			isToxic       : false,

			// todo reset defaults
		};

		this.analyzeComment = this.analyzeComment.bind( this );
		props.commentForm.addEventListener( 'submit', this.analyzeComment );
	}

	/**
	 * Test a comment for meanness
	 *
	 * This intentionally runs _after_ the commenter has finished writing it. I'm assuming that they'll be more open to
	 * editing it at this point, because they'll have already gotten their strong emotions off their chest.
	 *
	 * @param {object} event
	 */
	analyzeComment( event ) {
		event.preventDefault();

		this.setState( {
			interfaceOpen : true,
			loading       : true,
			// todo maybe don't need separate var for interfaceOpen? can just assume if loading or isToxic?
		}, () => {
			const { toxicSensitivity } = this.props;

			const data = {
				comment: {
					text: document.getElementById( 'comment' ).value,
						// todo probably use wp.util.sanitize() to strip html tags?,
						// limit is 3k, truncate to that if larger. maybe to consider multibyte chars?
				},

				languages : [ 'en' ],
				requestedAttributes : { TOXICITY: {} },

				// read through api docs to see what options are best to use here
				// minimize response to only stuff you'll use for performance
			};

			let newState = {};

			this.apiRequest( data ).then( data => {
				try {
					const score = data.attributeScores.TOXICITY.summaryScore.value;

					newState = { isToxic: score > toxicSensitivity / 100 }; // Convert internal user-friendly sensitivity to match API 0-1 range.
					// todo test ^ still works
				} catch ( Exception ) {
					newState = { error: Exception };
				}

			} ).catch( error => {
				console.log( 'error' );
				console.log(error);

				newState = {
					//error: `${error.data.status} ${error.code}: ${error.message}`
						// todo seems like `error` is sometimes a string, so ^ will break
					error
						// todo what happens when error is an object though?
						// it changes based on `parse`, so maybe always object unless `parse: false` ?
				};

				// maybe need to disable `parse` option so can see the full error details?
					// but wtf, why isn't the request showing up in the network console?

				console.error( `Compassionate Comments error: ${newState.error}` );
				// todo i18n/sprintf
				// maybe don't need state.error anymore? or still do for as a flag to know what to render?

				// what happens if someonne writes comment in unsupported language?
					// although maybe not if passing locale
					// ****** can't assume that blog locale is same as language that comment written in though, so maybe shouldn't pass it at all, and just let them detect it? ******

			} ).finally( () => {
				/*
				 * If an error occured, then just submit the comment, since that's safer than potentially
				 * preventing all comments from working.
				 */
				const submittingComment = newState.error || ! newState.isToxic;

				newState.loading       = false;
				newState.interfaceOpen = ! submittingComment;

				this.setState( newState, () => {
					if ( submittingComment ) {
						this.submitComment();

						// todo this works, but the UX is pretty bad b/c of all the flashing
						// modal pops up for split second, then closes, then page refreshes which causes another flash.
						// maybe shouldn't pop up the modal unless the API request is taking longer than X seconds?
					}
				} );
			} );
		} );
	}

	// todo explain convenience wrapper
	// using fetch() directly instead of apifetch b/c it's easier for remote requests
	// see https://github.com/WordPress/gutenberg/pull/15900#issuecomment-497139968
	apiRequest( data ) {
		const { perspectiveApiKey } = this.props;

		// todo document that exposing key isn't greay, but altnerative would be proxying the request via a REST API endpoint, which would be very slow
		// so just warned admins on settings screen to restrict the key to keep it safe
		const url                   = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${ perspectiveApiKey }`;

		const requestParams = {
			method      : 'POST',
			body        : JSON.stringify( data ),
			headers     : new Headers( { 'Content-Type': 'application/json' } ),
			credentials : 'omit',

			doNotStore : true, // tmp for testing, don't wanna pollute their data with testing stuff. is there a way to set this automatically?
				// todo set based on storeComments setting - need to flip it though, b/c of naming problem - https://github.com/conversationai/perspectiveapi/issues/58
				// but always set to true (don't store) when it's a private post
				// also try to automatically set to true when it's a dev environment, but how to detect that?
					// maybe don't, but disage the "store" setting in your test site?

				//			* default value should be to not store if blog is private - that'd be set in php
				//* maybe set it based on whether _post_ is public/private, not blog?
				// or assume if blog is private that all posts are private, even if they're technically set to "publish"
				//	does stock WP have a "private" setting for blogs, or is that just WPCOM. don't think so, maybe just use "search engine visibility" instead
				//* maybe have private posts not stored regardless of that setting, so that the setting just covers public posts on a public blog?

		};

		return fetch( url, requestParams ).then( response => response.json() );
	}

	/**
	 * Submit a comment despite the compassion nudge
	 *
	 * @param {object} event
	 */
	submitComment( event ) {
		// can be static?

		/*
		 * We can't just call form.submit(), because Core names the input button #submit, which overrides
		 * the handler.
		 *
		 * todo test ^ again using props.form
		 */
		document.createElement( 'form' ).submit.call( document.getElementById( 'commentform' ) );
	}

	render() {
		const { error, interfaceOpen, isToxic, loading } = this.state;

		// Commenters can't do anything about errors, so just submit their comment without analysis.
		if ( ! interfaceOpen || error ) {
			return null;
		}

		// need to show spinner to all comments, not just toxic ones
		// legit comments t

		return (
			<MainView
				handleSubmitAnyway={ this.submitComment }
				handleRephraseComment={ () => this.setState( { interfaceOpen: false } ) }
				handleModalClose={ () => this.setState( { interfaceOpen: false } ) }
				interfaceOpen={ interfaceOpen }
				loading={ loading }
				isToxic={ isToxic }
			/>
		);
	}
}
