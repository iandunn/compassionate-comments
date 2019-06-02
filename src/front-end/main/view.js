/**
 * WordPress dependencies
 */
import { Button, Modal, Spinner } from '@wordpress/components';
import { Fragment, RawHTML }      from '@wordpress/element';
import { __, sprintf }            from '@wordpress/i18n';


/**
 * Render the nudge that encourages commenters to be more compassionate.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
function Toxic( props ) {
	const { handleSubmitAnyway, handleRephraseComment } = props;

	const replyParent       = document.getElementById( 'respond' ).parentNode;
	const replyingToComment = replyParent.classList.contains( 'comment' );

	let parentAuthorAvatarUrl, parentAuthorName;

	if ( replyingToComment ) {
		// can't assume all themes output, so just need to look for an image where href*= gravatar.com
		parentAuthorAvatarUrl = replyParent.parentNode.querySelector( 'img.avatar' )[0].src;

		// only want to show avatar if it's one the user uploadoed though, b/c it has to be their actual face to make an impact
			// don't want to show default avatars. is there a way to detect that from url?
				// if not, maybe can in some other way, like by making a request like `get_avatar( $user, array( 'default' => '404' ) )`, and comparing the urls to see if they match?
					// have to make sure size etc ignored

		// maybe don't pull avatar/name from the DOM, b/c themes inconsistent?
			// maybe pull from REST API after page loados (but before the commit submission is attempted), and then match w/ comment IDs you pull from DOM?

		// get post w/ _embed to get comments? otherwise would just get latest comment
		// or can pass `parent` param?

		// oh, actually can export the comment author avatars too
			// what about caching? they should be flushed when new comments are added

		// modularize this

		// maybe move all this to controller and pass in as prop - probably better that way

		// wrap in try?
		// todo handle if false or whatever b/c theme not outputting or b/c author doesn't have one

		// can detect if it's mystery man rather than real photo? if so then don't display

		parentAuthorName      = parentComment && '';
	} else {

		// only some themes show the author avatar, and they might show them in different places, sigh
		// maybe use rest api to fetch. oh, just output from php
		parentAuthorAvatarUrl = parentComment && '';
		parentAuthorName      = parentComment && '';
	}

	//rename func to be more descriptive?

	// todo g component js/css too heavy for the little bits that you use?
		// do really wanna use modal though, don't wanna reinvent that wheel


	// todo refine messaging. what would be the most effective way to communicate this to someone who's generally kind but angry/frustrated?
		// maybe link to good article about assuming the person they're replying to has positive intent
		//  what does rethink say?

	// more descriptive name than "nudge" ?

	return (
		<div id="compassionate-comments__nudge">
			<p>
				{ __(
					'It looks like your comment is likely to be interpreted as being rude, disrespectful, or having negative intentions.',
					'compassionate-comments'
				) }
			</p>

			<p>
				<RawHTML>
					{ sprintf(
						/*
						 * SECURITY WARNING: This string is intentionally not internationalized, because there
						 * isn't a secure way to do that yet.
						 *
						 * See https://github.com/WordPress/gutenberg/issues/9846.
						 * See https://github.com/WordPress/gutenberg/issues/13156.
						 */
						'Please remember that there\'s another human being on the other end of this conversation, and they\'ll be impacted by the words that you write. It\'s also worth considering that you may have <a href="%s">misinterpreted their intentions</a>. Please consider rephrasing your comment to be more kind.',
						'https://www.edutopia.org/blog/assuming-positive-intent-laura-thomas'
					) }
				</RawHTML>

				{ parentComment && parentAuthorAvatarUrl &&
					<img src={ parentAuthorAvatarUrl } alt={ parentAuthorName } />
				}
			</p>

			<p>
				{ __( 'If you feel like your words are already kind, feel free to submit them anyway.', 'compassionate-comments' ) }
			</p>

			<Button isPrimary name="cc_rephrase_comment" onClick={ handleRephraseComment }>
				{ __( 'Edit comment', 'compassionate-comments' ) }
			</Button>

			{/* todo add isBusy to button when submitting comment? or not necessary b/c it'll be done via php? */}
			<Button isDefault isDestructive name="cc_submit_anyway" onClick={ handleSubmitAnyway }>
				{ __( 'Publish comment as-is', 'compassionate-comments' ) }
			</Button>
		</div>
	);
}


/**
 * Render the view for the main interface.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
export function MainView( props ) {
	const {
		interfaceOpen, loading, isToxic,
		handleModalClose, handleRephraseComment, handleSubmitAnyway
	} = props;

	let title,
	    modalClasses = [ 'compassionate-comments' ];

	if ( ! interfaceOpen ) {
		return null;
	}

	if ( loading ) {
		modalClasses.push( 'is-loading' );
		title = __( 'Analyzing comment...', 'compassionate-comments' );
	} else if ( isToxic ) {
		title = __( 'Please rephrase your comment.', 'compassionate-comments' );
	}

	// more elegant way to structure all this?
	// Decompise something if it has subcomponents, if it will be reused, if it's subjectively long or complex
	// maybe create separate files (but not folders) for some of those things? not sure

	return (
		<Modal
			className={ modalClasses }
			title={ title }
			onRequestClose={ handleModalClose }

			// Focusing on close button creates scrollbars -- https://github.com/WordPress/gutenberg/issues/15434.
			// Down key broken after hitting escape --  https://github.com/WordPress/gutenberg/issues/15429.
			isDismissable={ true }
		>
			{ loading && <Spinner /> }

			{ isToxic &&
				<Toxic
					handleSubmitAnyway={ handleSubmitAnyway }
					handleRephraseComment={ handleRephraseComment }
				/>
			}
		</Modal>
	);
}
