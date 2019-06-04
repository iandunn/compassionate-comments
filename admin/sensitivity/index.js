/**
 * WordPress dependencies
 */
import { RangeControl } from '@wordpress/components';
import { __, sprintf }  from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Card }           from '../card';
import { sampleComments } from './sample-comments';


/**
 * Render the the Sensitivity setting.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
export function Sensitivity( props ) {
	const { onChange, sensitivity } = props;

	// todo how to deal with duplicate title/labels from rangecontrol and card?
		// maybe don't pass title to card, and style rangecontrol label inside card?
		// might be easier to do reverse, and hide the label for rangecontrol
		// same in other functions

	// todo wanna style the help _ABOVE_ the control. maybe possible w/ flex/grid, but still can't add html to it
		// see github issue 15904 linked below

	return (
		<Card title="Sensitivity">
			<p>
				{ __( "Comment authors are warned when their comment's toxicity score exceeds this number.", 'compassionate-comments' ) }
			</p>

			<RangeControl
				label="Sensitivity"
				//help="Comment authors are warned when their comment's toxicity score exceeds this number."    // todo should use this, but style it to go above instead of below?
					// related: https://github.com/WordPress/gutenberg/issues/15904
				initialPosition={ sensitivity }
					// todo ^ is supposed to be default value, but without setting this the thumb is positioned in middle no matter what. probably bug, but didn't reproduce in other context
				onChange={ onChange }
				min={ 0 }
				max={ 100 }
				value={ sensitivity }
			/>

			<p>
				{ sprintf(
					// Translators: %s is a number between 0 and 100.
					__( 'Example of %s%% toxic:', 'compassionate-comments' ),
					sensitivity
				) }
				<blockquote>{ sampleComments[ sensitivity ] }</blockquote>
			</p>

			<p className="notice notice-info">
				{ __( 'Changing this will not have any effect retroactively, it will only determine the behavior for new comments.', 'compassionate-comments' ) }
			</p>
		</Card>
	);
}
