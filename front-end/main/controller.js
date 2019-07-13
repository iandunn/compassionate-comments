/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MainView }     from './view';
import { consoleError } from '../../common/common';


/**
 * Manage the state and logic for the main interface.
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
		try {
			/*
			 * Intentionally not using the value, just making sure it exists so it can be used in the (out of
			 * scope) callback below.
			 */
			document.getElementById( 'comment' ).value;
		} catch ( Exception ) {
			consoleError( Exception );
			return;
		}

		event.preventDefault();

		this.setState( {
			interfaceOpen : true,
			loading       : true,
		}, () => {
			const { perspectiveSensitivity } = this.props;
			const comment                    = document.getElementById( 'comment' ).value;
			let newState                     = {};

			this.sendScoreRequest( comment ).then( data => {
				try {
					const score = data.attributeScores.TOXICITY.summaryScore.value;
					newState    = { isToxic : score > perspectiveSensitivity / 100 }; // Convert internal user-friendly sensitivity to match API 0-1 range.

					this.logScore( score );
				} catch ( Exception ) {
					newState = { error: Exception };
				}

			} ).catch( error => {
				newState = { error };

			} ).finally( () => {
				if ( newState.error ) {
					consoleError( newState.error );
				}

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

	/**
	 * Send a request to the Perspective API to analyse a comment.
	 *
	 * This uses `fetch()` directly instead of `apifetch()`, because the latter is only intended for interacting
	 * with WP REST API endpoints, and there are lots of difficulties making it work with arbitrary APIs.
	 *
	 * See https://github.com/WordPress/gutenberg/pull/15900#issuecomment-497139968.
	 *
	 * @param {string} commentText
	 *
	 * @return {Promise}
	 *  todo should be {Promise<Response>} ? probably
	 */
	sendScoreRequest( commentText ) {
		const { perspectiveApiKey } = this.props;

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

	/**
	 * Determine the `doNotStore` setting for the Perspective API request.
	 */
	doNotStore() {
		const { isTestEnvironment, postIsPublic, siteIsPublic, perspectiveStoreComments } = this.props;

		/*
		 * Flip the setting because our internal version is the opposite, for better UX.
		 *
		 * See https://github.com/conversationai/perspectiveapi/issues/58.
		 */
		let doNotStore = ! perspectiveStoreComments;

		if ( perspectiveStoreComments ) {
			/*
			 * Storing private posts/comments would violate privacy expectations, and storing comments from test
			 * environments would distort Perspective's data set.
			 */
			if ( isTestEnvironment || ! siteIsPublic || ! postIsPublic ) {
				doNotStore = true;
			}
		}

		return doNotStore;
	}

	/**
	 * Log the comment's score(s) in the database for stats.
	 *
	 * This isn't used yet, but future versions may add a stats dashboard, so the site owner can see the impact
	 * that the plugin has had, and fine-tune their Sensitivity setting.
	 *
	 * This intentionally doesn't overwrite previous scores when the comment author chooses to edit their comment,
	 * so that the stats can show how often authors make that choice, and the delta between the `before` and `after`
	 * scores.
	 *
	 * @param {float} score
	 */
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
		logEntry.name  = `comcon_comment_meta[${ entryId }]`;
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
		// todo can be static unless below changes

		/*
		 * We can't just call form.submit(), because Core names the input button #submit, which overrides
		 * the handler.
		 *
		 * todo test ^ again using props.form, might be possible to simplify this
		 */
		try {
			document.createElement( 'form' ).submit.call( document.getElementById( 'commentform' ) );
		} catch ( Exception ) {
			consoleError( Exception );
		}
	}

	render() {
		const { error, interfaceOpen, isToxic, loading } = this.state;

		// Commenters can't do anything about errors, so just submit their comment without analysis.
		if ( ! interfaceOpen || error ) {
			return null;
		}
		// todo should ^ be inside MainView instead of here?

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
