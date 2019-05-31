/**
 * WordPress dependencies
 */
import { Button, RangeControl, ToggleControl, TextControl } from '@wordpress/components';
import { Fragment }                          from '@wordpress/element';
import { __ }                                from '@wordpress/i18n';

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
				Your API key allows the plugin to use the Perspective API in order to analyze comments for toxicity.
			</p>

			{ ! apiKey &&
				<p className="notice notice-error">
					You have not entered an API key yet. This plugin will not work until you do. You can <a href="https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md">get one for free</a>.
				</p>
			}

			<TextControl
				label="Perspective API Key"
				value={ apiKey }
				onChange={ onChange }
				placeholder="BJfjSyDRq7yoR2PK3DNB3sjkah1Z5ubOCq6HfMn"
			/>

			<p className="notice notice-warning">
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
			<p>Comment authors are warned when their comment's toxicity score exceeds this number.</p>

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
				Example of {sensitivity}% toxic:
				<blockquote>{ sampleComments[ sensitivity ] }</blockquote>
			</p>

			<p className="notice notice-info">
				Changing this will not have any effect retroactively, it will only determine the behavior for new comments.
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
				Allowing the Perspective API to store your comments permenantly helps them train their models to be more accurate.
			</p>

			<ToggleControl
				label="Store Comments"
				//help="describe here too?"
				checked={ checked }
				onChange={ onChange }
			/>

			<p>
				If this is disabled, they will still receive and analyze the comment, but have promised not to retain it.
			</p>

			<p className="notice notice-info">
				Comments on private posts will never be stored, regardless of this setting.
				{/* todo is that accurate? need to decide what will actually do. */}
			</p>

			{/* todo maybe show warning if set to store comments, but blog is set to private/block serarch engines/whatever you can use as indicator that it's private */}
		</Card>
	);
}

//todo
/*
	when click save button,
		disable button
		show "saving..."
			show "saved x min ago [green checkmark icon]" next to it
			show "failed to save"
		re-enable save button
	when change option, clear the "saved/failed" message
	make all of ^ a reusable component, b/c will want to copy for other plugins
	see if anything similar exists in G, but not likely

	maybe button should always be disabled, but then enable it when state changes, then disable again once saved to db?
 */
function SaveButton( props ) {
	const { onClick, lastSave, savingSettings } = props;

	return (
		<Fragment>
			<Button
				isPrimary
				isBusy={ savingSettings }
				onClick={ onClick }
			>
				Save Settings
			</Button>

			{ savingSettings &&
				<p>Saving...</p>
			}

			{ ! savingSettings &&
				<p>
					Saved { lastSave }
				</p>
			}
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
		storeComments, perspectiveApiKey, savingSettings, toxicSensitivity,
		handleApiKeyChange, handleStoreCommentsChange, handleSaveSettings, handleToxicSensitivityChange
	} = props;

	// maybe all these should be wrapped in div instead of fragment? feels bad to have extra/unnecessary wrappers
		// but also conceptually wrong for an isolated component to assume it's not reusable / used in other contexts / be aware of the container

	return (
		<Fragment>
			<p>
				This plugin checks the intent of a comment before it's submitted. If the author is being rude or disrespectful, it will encourage them to think twice, and give them a chance to rephrase their comment to be more kind before they submit it.
			</p>

			<p>
				Google's <a href="https://www.perspectiveapi.com/">Perspective API</a> is used to determine the characteristics of the comment, which means that all comments will be sent to their servers for analysis.
			</p>

			<div id="comcon-admin__settings">
				<ApiKey
					apiKey={ perspectiveApiKey }
					onChange={ handleApiKeyChange }
				/>

				<Sensitivity
					sensitivity={ toxicSensitivity }
					onChange={ handleToxicSensitivityChange }
				/>

				<StoreComments
					checked={ storeComments }
					onChange={ handleStoreCommentsChange }
				/>
			</div>

			<SaveButton
				onClick={ handleSaveSettings }
				lastSave={ '3 minutes ago' }
				savingSettings={ savingSettings }
			/>
			{/* todo lastave dynamic. maybe too much trouble? just do something simpler? user should know if saved or not though, shouldn't have to guess */}
		</Fragment>
	);
}
