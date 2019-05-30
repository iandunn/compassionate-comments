/**
 * WordPress dependencies
 */
import { Button, TextControl, RangeControl } from '@wordpress/components';
import { Fragment }                          from '@wordpress/element';
import { __ }                                from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { sampleComments } from './sample-comments';


// i18n

// todo
function ApiKey( props ) {
	const { onChange, apiKey } = props;

	return (
		<Fragment>
			<TextControl
				label="Perspective API Key"
				value={ apiKey }
				onChange={ onChange }
			/>

			<p>
				docs to get api key - textcontrol
				link to quickstart but also explanation of what's wrong w/ their instructions
				warning to restrict api key per domain****
			</p>
		</Fragment>
	);
}

// todo
function Sensitivity( props ) {
	const { onChange, sensitivity } = props;

	return (
		<Fragment>
			<RangeControl
				label="Sensitivity"
				help="Comments that score higher than this number will trigger a warning to the comment author."
				value={ sensitivity }
				onChange={ onChange }
				min={ 1 }
				max={ 100 }
			/>

			<p>
				Example of {sensitivity}% toxic:
				<blockquote>{ sampleComments[ sensitivity ] }</blockquote>
			</p>
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
		handleApiKeyChange, handleSaveSettings, handleToxicSensitivityChange,
		perspectiveApiKey, savingSettings, toxicSensitivity
	} = props;

	return (
		<Fragment>
			<ApiKey
				apiKey={ perspectiveApiKey }
				onChange={ handleApiKeyChange }
			/>

			<Sensitivity
				sensitivity={ toxicSensitivity }
				onChange={ handleToxicSensitivityChange }
			/>

			<p>other settings</p>

			<Button
				isPrimary
				isBusy={ savingSettings }
				onClick={ handleSaveSettings }
			>
				Save Settings
			</Button>
		</Fragment>
	);
}
