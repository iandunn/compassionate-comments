/**
 * WordPress dependencies
 */
import { Button, Modal, Spinner } from '@wordpress/components';
import { RawHTML }                from '@wordpress/element';
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

	// todo refine messaging. what would be the most effective way to communicate this to someone who's generally kind but angry/frustrated?
		// maybe link to good article about assuming the person they're replying to has positive intent
		//  what does rethink say?

	// more descriptive name than "nudge" ?

	return (
		<div id="comcon-front-end__nudge">
			<p>
				{ __(
					'It looks like your comment is likely to be interpreted as rude or disrespectful.',
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
						'Please remember that there\'s another human being on the other end of this conversation, and they\'ll be affected by the words that you write. It\'s also worth considering that you may have <a href="%s">misinterpreted their intentions</a>. Please consider rephrasing your comment to be more kind.',
						'https://www.edutopia.org/blog/assuming-positive-intent-laura-thomas'
					) }
				</RawHTML>
			</p>

			<Button isPrimary name="cc_rephrase_comment" onClick={ handleRephraseComment }>
				{ __( 'Edit Comment', 'compassionate-comments' ) }
			</Button>

			{ /* todo add isBusy to button when submitting comment? or not necessary b/c it'll be done via php?
			not strictly necessary, but it'd be nice since to show a spinner or something b/c it could take a few seconds
			isBusy doesn't seem to work, but not sure why, maybe b/c front end, or maybe b/c isLink?
			*/ }
			<Button isDefault isDestructive isLink name="cc_submit_anyway" onClick={ handleSubmitAnyway }>
				{ __( 'Submit Anyway', 'compassionate-comments' ) }
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
		handleModalClose, handleRephraseComment, handleSubmitAnyway,
	} = props;

	const modalClasses = [ 'comcon-front-end' ];
	let title;

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
