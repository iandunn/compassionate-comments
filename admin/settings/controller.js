/**
 * WordPress dependencies
 */
import apiFetch      from '@wordpress/api-fetch';
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
	/**
	 * Initialize the component.
	 *
	 * @param {Array} props
	 */
	constructor( props ) {
		super( props );

		const { perspectiveApiKey, perspectiveStoreComments, perspectiveSensitivity } = props;

		this.state = {
			perspectiveApiKeyError   : false,
			perspectiveApiKey        : perspectiveApiKey,
			perspectiveStoreComments : perspectiveStoreComments,
			perspectiveSensitivity   : perspectiveSensitivity,
			saveSettingsError        : '',
			savedSettings            : false,
			savingSettings           : false,
		};

		// todo ^ feels weird b/c then you have props.sensitivity and state.sensitivity and they don't match
			// maybe that's ok though?
			// or maybe this is a smell that i'm doing something wrong?
	}

	/**
	 * Run initialization that can't happen until the component is mounted.
	 */
	componentDidMount() {
		this.testApiKey( this.state.perspectiveApiKey );
	}

	/**
	 * Test if the Perspective API key is valid.
	 *
	 * @param {string} apiKey
	 */
	async testApiKey( apiKey ) {
		const newState    = {};
		const testMessage = 'This is a test to see if the user set a valid API key.';

		if ( ! apiKey ) {
			// Don't need to set an error here, because the `ApiKey` component already shows an error when the key is empty.
			return;
		}

		// Set `doNotStore` to avoid distorting Perspective's data with test comments.
		const results = await sendScoreRequest( apiKey, testMessage, true );

		try {
			// Intentionally not using the value, just check if it exists as a way to see if the key works.
			const score = results.attributeScores.TOXICITY.summaryScore.value;
		} catch ( exception ) {
			// `results.error` is more meaningful than `exception`, so use that.
			newState.perspectiveApiKeyError = getErrorMessage( results.error || results || exception );
		}

		this.setState( newState );
	}

	/**
	 * Save the current settings to the database via the REST API.
	 */
	saveSettings() {
		this.setState( { savingSettings: true }, async () => {
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

			try {
				await apiFetch( fetchParams );
				await this.testApiKey( perspectiveApiKey );

			} catch ( error ) {
				consoleError( error ); // The full object might still be useful, even though the message will be displayed to the user.

				newState.savedSettings     = false;
				newState.saveSettingsError = getErrorMessage( error );

			} finally {
				this.setState( newState );
			}
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

	/**
	 * Render the component.
	 *
	 * @return {Element}
	 */
	render() {
		const { siteIsPublic } = this.props;

		const {
			perspectiveApiKey, perspectiveApiKeyError, perspectiveStoreComments, perspectiveSensitivity,
			savedSettings, saveSettingsError, savingSettings,
		} = this.state;

		return (
			<SettingsView
				/* The key is changing, so errors associated with the old key are no longer relevant. */
				handleApiKeyChange={                 perspectiveApiKey        => this.updateSetting( { perspectiveApiKey : perspectiveApiKey, perspectiveApiKeyError : false } ) }
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
