/**
 * WordPress dependencies
 */
import { Component }   from '@wordpress/element';
import { __, sprintf } from '@wordpress/i18n';
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

		// Save default state so we can easily reset back to it when needed.
		this.defaultState = {
			error         : false,
			interfaceOpen : false,
			// todo rename ^, "interface" is artifact from QNI. this is something more like warningAuthor
			loading       : false,
			isToxic       : false,
		};

		this.state = this.defaultState;

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
			const comment              = document.getElementById( 'comment' ).value;
			let newState               = {};

			this.sendScoreRequest( comment ).then( data => {
				try {
					const score = data.attributeScores.TOXICITY.summaryScore.value;
					newState    = { isToxic: score > toxicSensitivity / 100 }; // Convert internal user-friendly sensitivity to match API 0-1 range.

					this.logScore( score );
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

				console.error( sprintf(
					__( 'Compassionate Comments error: %s', 'compassionate-comments' ),
					newState.error
				) );
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
	sendScoreRequest( commentText ) {
		const { perspectiveApiKey } = this.props;

		/*
		 * The `languages` parameter is intentionally _not_ set, because we have no way of knowing what language
		 * the comment is written in. On many sites it could easily be a different language than `get_locate()`.
		 * Perspective will automatically detect the language when an explicit value isn't passed.
		 */
		const data = {
			comment: {
				text: commentText,
					// todo probably use wp.util.sanitize() to strip html tags?,
					// limit is 3k, truncate to that if larger. maybe to consider multibyte chars?
			},

			requestedAttributes : { TOXICITY: {} },
		};

		// todo document that exposing key isn't great, but alternative would be proxying the request via a REST API endpoint, which would be very slow
		// so just warned admins on settings screen to restrict the key to keep it safe
		const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${ perspectiveApiKey }`;

		data.doNotStore = this.doNotStore();

		const requestParams = {
			method      : 'POST',
			body        : JSON.stringify( data ),
			headers     : new Headers( { 'Content-Type': 'application/json' } ),
			credentials : 'omit',
		};

		return fetch( url, requestParams ).then( response => response.json() );
	}

	// todo
	doNotStore() {
		const { isTestEnvironment, postIsPublic, siteIsPublic, storeComments } = this.props;

		/*
		 * Flip the setting because our internal version is the opposite, for better UX.
		 *
		 * See https://github.com/conversationai/perspectiveapi/issues/58.
		 */
		let doNotStore = ! storeComments;

		if ( storeComments ) {
			/*
			 * Storing private posts/comments would violate privacy expectations, and storing comments from test
			 * environments would distort Perspective's data set.
			 */
			if ( isTestEnvironment || ! siteIsPublic || ! postIsPublic ) {
				doNotStore = true;
			}

			// todo test all these paths
		}

		return doNotStore;
	}

	// todo
	// logs each score for a comment
	// intentionally not overwriting any previous ones, want to have a record of how many times they edited and see how score changed
	logScore( score ) {
		const { commentForm } = this.props;
		const logEntry        = document.createElement( 'input' );
		const entryId         = `comcon_perspective_score_${ Date.now() }`;

		/*
		 * The `comcon_` prefix is added because, in the future, Core might automatically insert values that scripts
		 * add to the standard `comment_meta` field.
		 *
		 * See https://core.trac.wordpress.org/47447.
		 *
		 * If that happens, then `Compassionate_Comments\inject_comment_meta()` would insert the values for a second
		 * time. So the prefix future-proofs this against that possibility.
		 */
		logEntry.name  = `comcon_comment_meta[${entryId}]`;
		logEntry.type  = 'hidden';
		logEntry.value = score;

		commentForm.appendChild( logEntry );
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
		// should ^ be inside MainView instead of here?

		// need to show spinner to all comments, not just toxic ones
		// legit comments t

		return (
			<MainView
				handleSubmitAnyway={ this.submitComment }
				handleRephraseComment={ () => this.setState( { ...this.defaultState } ) }
				handleModalClose={ () => this.setState( { ...this.defaultState } ) }
				interfaceOpen={ interfaceOpen }
				loading={ loading }
				isToxic={ isToxic }
			/>
		);
	}
}
