/**
 * WordPress dependencies
 */
import { Button, RangeControl, ToggleControl, TextControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';
import { __ }       from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { Card }           from '../card';
import { sampleComments } from './sample-comments';


// i18n

// todo
function ApiKey( props ) {
	const { onChange, apiKey } = props;

	return (
		<Card title="Perspective API Key">
			<p>
				{ __( 'Your API key allows Compassionate Comments to use the Perspective API in order to analyze comments for toxicity.', 'compassionate-comments' ) }
			</p>

			{ ! apiKey &&
				<p className="notice notice-error">
					{/* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */}
					You have not entered an API key yet, and this plugin can't work until you do. You can <a href="https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md">get one for free</a>.
				</p>
			}

			<TextControl
				label="Perspective API Key"
				value={ apiKey }
				onChange={ onChange }
				placeholder="BJfjSyDRq7yoR2PK3DNB3sjkah1Z5ubOCq6HfMn"
			/>

			<p className="notice notice-warning">
				{/* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */}
				It's <strong>very important</strong> that you <a href="https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions">restrict your API key</a> {}
				to your server's domain name, IP address, or other unique identifier. If you don't, it's likely that the key will be abused and the plugin will stop working.
			</p>
		</Card>
	);
}

// todo
function Sensitivity( props ) {
	const { onChange, sensitivity } = props;

	// todo how to deal with duplicate title/labels from rangecontrol and card?
		// maybe don't pass title to card, and style rangecontrol label inside card?
		// might be easier to do reverse, and hide the label for rangecontrol
		// same in other functions

	// todo wanna style the help _ABOVE_ the control

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

// todo
function StoreComments( props ) {
	const { checked, onChange } = props;

	// todo clarify title that this stores comments on Perspective servers, not this local wp server

	return (
		<Card title="Store Comments">
			<p>
				{ __( 'Allowing the Perspective API to store your comments permenantly helps them train their models to be more accurate.', 'compassionate-comments' ) }
			</p>

			<ToggleControl
				label="Store Comments"
				//help="describe here too?"
				checked={ checked }
				onChange={ onChange }
			/>

			{/* todo why is ^ not styled correctly in core trunk environment, but is in latest stable environment? */}

			<p>
				{ __(
					"If this is disabled, they will still receive and analyze the comment, but have promised to discard it after they've finished analyzing it, rather than retaining it.",
					'compassionate-comments'
				) }
			</p>

			<p className="notice notice-info">
				{ __( 'Comments on private posts will never be stored, regardless of this setting.', 'compassionate-comments' ) }

				{/* todo phrase that more accurately, like,
				we will always ask the api to disacard comments that belong to private posts, regardless of this setting
				*/}
			</p>
		</Card>
	);
}


// todo
function StoreCommentsDisabled( props ) {
	// todo clarify title that this stores comments on Perspective servers, not this local wp server

	return (
		<Card title="Store Comments">
			<p>
				{ __( 'Allowing the Perspective API to store your comments permenantly helps them train their models to be more accurate.', 'compassionate-comments' ) }
			</p>

			{/* todo add disabled field? but component just ignnores is. maybe open ticket that it should pass props to input field*/}
			<ToggleControl
				label="Store Comments"
				//help="describe here too?"
				checked={ false }
			/>

			{/* todo why is ^ not styled correctly in core trunk environment, but is in latest stable environment? */}

			<p className="notice notice-info">
				{/* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */}
				Because <a href="options-reading.php">your site is marked as private</a>, we will always ask Perspective to discard your comments after they've analyzed them.
				{/* todo might need to epxlain it's the "search engine" setting, b/c that's not obvious */}
			</p>
		</Card>
	);
}

//todo
function SaveButton( props ) {
	const { onClick, savingSettings } = props;

	return (
		<Fragment>
			<Button
				isPrimary
				disabled={ savingSettings }
				isBusy={ savingSettings }
				onClick={ onClick }
			>
				{ __( 'Save Settings', 'compassionate-comments' ) }
			</Button>
		</Fragment>
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
		languageSupported, perspectiveApiKey, savingSettings, siteIsPublic, storeComments, toxicSensitivity,
		handleApiKeyChange, handleStoreCommentsChange, handleSaveSettings, handleToxicSensitivityChange
	} = props;

	// maybe all these should be wrapped in div instead of fragment? feels bad to have extra/unnecessary wrappers
		// but also conceptually wrong for an isolated component to assume it's not reusable / used in other contexts / be aware of the container

	return (
		<Fragment>
			<p>
				{ __(
					"This plugin checks the intent of a comment before it's submitted. If the author is being rude or disrespectful, it will encourage them to think twice, and give them a chance to rephrase their comment to be more kind before they submit it.",
					'compassionate-comments'
				) }
			</p>

			<p>
				{/* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */}
				Google's <a href="https://www.perspectiveapi.com/">Perspective API</a> is used to determine the characteristics of the comment, which means that all comments will be sent to their servers for analysis.
			</p>

			{ ! languageSupported &&
				<Fragment>
					<span className="wp-header-end">
						{/* This hidden element prevents WP from moving the notice below up into the typical admin_notice area. */}
					</span>

					<div className="notice notice-warning">
						<p>
							{ __(
								'The Perspective API can only analyze comments written in English, French, and Spanish. Comments written in other languages will be submitted without any analysis or content warnings.',
								'compassionate-comments'
							) }
						</p>
					</div>
				</Fragment>
			}

			<div id="comcon-admin__settings">
				<ApiKey
					apiKey={ perspectiveApiKey }
					onChange={ handleApiKeyChange }
				/>

				<Sensitivity
					sensitivity={ toxicSensitivity }
					onChange={ handleToxicSensitivityChange }
				/>

				{ siteIsPublic &&
					<StoreComments
						checked={ storeComments }
						onChange={ handleStoreCommentsChange }
					/>
				}

				{ ! siteIsPublic &&
					<StoreCommentsDisabled />
				}
			</div>

			<SaveButton
				onClick={ handleSaveSettings }
				savingSettings={ savingSettings }
			/>
		</Fragment>
	);
}
