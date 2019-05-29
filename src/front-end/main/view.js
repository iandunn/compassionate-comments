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
						'Please remember that there\'s another human being on the other end of this conversation, and they\'ll be impacted by the words that you write. It\'s also worth considering that you may be <a href="%s">misinterpreting their intentions</a>. Please consider rephrasing your comment to be more kind.',
						'https://www.edutopia.org/blog/assuming-positive-intent-laura-thomas'
					) }
				</RawHTML>
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
function View( props ) {
	const { handleSubmitAnyway, handleRephraseComment, interfaceOpen, loading, handleModalClose, isToxic } = props;

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

export default View;
