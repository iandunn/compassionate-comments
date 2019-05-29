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
import View from './view';

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
			// api request
				// promoise sets loading/error/reponse

			// curl -H "Content-Type: application/json" --data     '{comment: {text: "what kind of idiot name is foo?"},      languages: ["en"],      requestedAttributes: {TOXICITY:{}} }'     https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=props.key
			// can use requestedAttributes or other params to minimize size of response and increase speed of it?

			// if there's an error, add to console.error()
				// will happen if someonne writes comment in unsupported language
				// although maybe not if passing locale
				// ****** can't assume that blog locale is same as language that comment written in though, so maybe shouldn't pass it at all, and just let them detect it? ******
				//


			const commentText = document.getElementById( 'comment' ).value;
			// todo probably use wp.util.sanitize() to strip html tags?

			// tmp
			this.setState( {
				//error: 'api creds rejected'
				loading : false,
				isToxic : true,
				//isToxic : false,
			} );

			// if promise returns and comment is ok, call submitComment()
		} );
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
			<View
				handleSubmitAnyway={ this.submitComment }
				//handleRephraseComment={ this.setState( { interfaceOpen: false } ) }
				//handleModalClose={ this.setState( { interfaceOpen: false } ) }
					// wtf modal instantly closes and triggeres re-render when uncomment these
					// has to do w/ unexpected interation w/  the `return null` above?
				interfaceOpen={ interfaceOpen }
				loading={ loading }
				isToxic={ isToxic }
			/>
		);
	}
}
