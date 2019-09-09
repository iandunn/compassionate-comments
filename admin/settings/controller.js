/**
 * WordPress dependencies
 */
import { apiFetch }  from '@wordpress/api-fetch';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { SettingsView }                                    from './view';
import { consoleError, getErrorMessage, sendScoreRequest } from '../../common/common';


/**
 * Manage the state and logic for the main interface.
 */
export class SettingsController extends Component {
	constructor( props ) {
		super( props );

		const { perspectiveApiKey, perspectiveStoreComments, perspectiveSensitivity } = props;

		this.state = {
			savingSettings         : false,
			savedSettings          : false,
			saveSettingsError      : '',
			perspectiveApiKeyError : false,
			perspectiveApiKey,
			perspectiveStoreComments,
			perspectiveSensitivity,
		};

		// todo ^ feels weird b/c then you have props.sensitivity and state.sensitivity and they don't match
			// maybe that's ok though?
			// or maybe this is a smell that i'm doing something wrong?
	}

	componentDidMount() {
		this.testApiKey( this.state.perspectiveApiKey );
	}

	/**
	 * Test if the Perspective API key is valid.
	 *
	 * @param {string} apiKey
	 */
	testApiKey( apiKey ) {
		const newState    = {};
		const testMessage = 'This is a test to see if the user set a valid API key.';

		if ( ! apiKey ) {
			return;
		}

		// Set `doNotStore` to avoid distorting Perspective's data with test comments.
		sendScoreRequest( apiKey, testMessage, true ).then( data => {
			try {
				// Intentionally not using the value, just check if it exists as a way to see if the key works.
				const success = data.attributeScores.TOXICITY.summaryScore.value;
				newState.perspectiveApiKeyError = false;
			} catch ( Exception ) {
				newState.perspectiveApiKeyError = getErrorMessage( data.error );
			}

		} ).catch( error => {
			newState.perspectiveApiKeyError = getErrorMessage( error );

		} ).finally( () => {
			this.setState( newState );
		} );
	}

	/**
	 * Save the current settings to the database via the REST API.
	 */
	saveSettings() {
		this.setState( { savingSettings: true }, () => {
			const { apiFetch } = wp;
				// todo this shouldn't be necessary since imported above, but otherwise it's undefined. file bug report, or you're doing something wrong?
				// maybe it's `import apiFetch` vs `import { apiFetch }` ?
			const { perspectiveApiKey, perspectiveStoreComments, perspectiveSensitivity } = this.state;
			const newState = {
				savedSettings  : true,
				savingSettings : false,
			};

			const fetchParams = {
				path   : '/wp/v2/settings',
				method : 'PUT',
				data   : {
					comcon_perspective_api_key        : perspectiveApiKey,
					comcon_perspective_sensitivity    : perspectiveSensitivity,
					comcon_perspective_store_comments : perspectiveStoreComments,
				},
			};

			apiFetch( fetchParams ).then( data => {
				this.testApiKey( perspectiveApiKey );

			} ).catch( error => {
				consoleError( error ); // The full object might still be useful, even though the message will be displayed to the user.

				newState.savedSettings     = false;
				newState.saveSettingsError = getErrorMessage( error );

			} ).finally( () => {
				this.setState( newState );
			} );
		} );
	}


	/**
	 * Update a setting and hide the `Saved` notice.
	 *
	 * When a setting is changed in state, the `Saved` notice should be removed, since it's not longer true. This
	 * could probably be done in a lifecycle method rather than having a wrapper around `setState()`, but those
	 * seem to be easily misunderstood, and it'd probably also result in multiple `setState()` calls. This is
	 * just simpler.
	 *
	 * @param {object} newState
	 */
	updateSetting( newState ) {
		newState.savedSettings = false;

		this.setState( newState );
	}

	render() {
		const { siteIsPublic } = this.props;

		const {
			perspectiveApiKey, perspectiveApiKeyError, perspectiveStoreComments, perspectiveSensitivity,
			savedSettings, saveSettingsError, savingSettings,
		} = this.state;

		return (
			<SettingsView
				/* The key is changing, so errors associated with the old key are no longer relevant. */
				handleApiKeyChange={                 perspectiveApiKey        => this.updateSetting( { perspectiveApiKey, perspectiveApiKeyError : false } ) }
				handleStoreCommentsChange={          perspectiveStoreComments => this.updateSetting( { perspectiveStoreComments } ) }
				handlePerspectiveSensitivityChange={ perspectiveSensitivity   => this.updateSetting( { perspectiveSensitivity} ) }

				handleSaveSettings={ () => this.saveSettings() }
				perspectiveApiKey={ perspectiveApiKey }
				perspectiveApiKeyError={ perspectiveApiKeyError }
				savedSettings={ savedSettings }
				saveSettingsError={ saveSettingsError }
				savingSettings={ savingSettings }
				perspectiveStoreComments={ perspectiveStoreComments }
				siteIsPublic={ siteIsPublic }
				perspectiveSensitivity={ perspectiveSensitivity }

				// todo maybe align the vars above?
			/>
		);
	}
}
