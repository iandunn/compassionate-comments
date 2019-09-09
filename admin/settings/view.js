/**
 * WordPress dependencies
 */
import { Button, Dashicon, ToggleControl, TextControl } from '@wordpress/components';
import { Fragment }                                     from '@wordpress/element';
import { __, sprintf }                                  from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Card }        from '../card';
import { Sensitivity } from './sensitivity';

/**
 * Render the view for the API Key setting.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
function ApiKey( { onChange, apiKey, apiKeyError } ) {
	return (
		<Card title="Perspective API Key">
			<p>
				{ __( 'Your API key allows Compassionate Comments to use the Perspective API in order to analyze comments for toxicity.', 'compassionate-comments' ) }
			</p>

			{ apiKeyError &&
				<div className="notice notice-error inline">
					<p>
						{ /* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */ }
						Perspective API Error: <code>{ apiKeyError }</code>
					</p>

					<p>
						{ __(
							"Please make sure that your key is correct, not restricted by IP or referrer, and not over its quota.",
							'compassionate-comments'
						) }
					</p>
				</div>
			}

			{ ! apiKey &&
				<p className="notice notice-error inline">
					{ /* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */}
					You have not entered an API key yet, and this plugin can't work until you do. You can <a href="https://github.com/conversationai/perspectiveapi/blob/master/quickstart.md">get one for free</a>.
				</p>
			}

			<TextControl
				label="Perspective API Key"
				value={ apiKey }
				onChange={ onChange }
				placeholder="BJfjSyDRq7yoR2PK3DNB3sjkah1Z5ubOCq6HfMn"
			/>

			<p className="notice notice-warning inline">
				{ /* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */}
				It's <strong>very important</strong> that you <a href="https://cloud.google.com/docs/authentication/api-keys#api_key_restrictions">restrict your API key</a> {}
				to just the Perspective API. If you don't, any abuse of it can cause other services to stop working.
			</p>
		</Card>
	);
}

/**
 * Render the view for the Store Comments setting.
 *
 * See `StoreCommentsDisabled` for when the setting is automatically disabled.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
function StoreComments( { checked, onChange } ) {
	return (
		<Card title="Store Comments">
			<p>
				{ __( 'Allowing the Perspective API to store your comments permenantly helps them train their machine learning models to be more accurate.', 'compassionate-comments' ) }
			</p>

			<ToggleControl
				label="Store Comments on Perspectives' servers"
				checked={ checked }
				onChange={ onChange }
			/>

			<p>
				{ __(
					"If this is disabled, they will still receive and analyze the comment, but have promised to discard it after they've finished analyzing it, rather than retaining it.",
					'compassionate-comments'
				) }
			</p>

			<p className="notice notice-info inline">
				{ __( 'Comments on private posts will never be stored, regardless of this setting.', 'compassionate-comments' ) }
			</p>
		</Card>
	);
}

/**
 * Render the view for when the Store Comments setting is automatically disabled.
 *
 * See `StoreComments` for when the setting is not disabled.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
function StoreCommentsDisabled( props ) {
	// todo make this DRY with StoreComments

	return (
		<Card title="Store Comments">
			<p>
				{ __( 'Allowing the Perspective API to store your comments permenantly helps them train their machine learning models to be more accurate.', 'compassionate-comments' ) }
			</p>

			{ /* todo add `disabled` field? but component just ignores it. maybe open ticket that it should pass props to input field */}
			<ToggleControl
				label="Store Comments on Perspectives' servers"
				checked={ false }
			/>

			<p className="notice notice-info inline">
				{ /* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */}
				Because <a href="options-reading.php">your site is marked as private</a> (from search engines), we will always ask Perspective to discard your comments after they've analyzed them.
			</p>
		</Card>
	);
}

/**
 * Render the view for the Save Settings button.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
function SaveButton( props ) {
	const { onClick, savedSettings, saveSettingsError, savingSettings } = props;

	return (
		<div className="comcon-admin-main__save">
			<Button
				isPrimary
				disabled={ savingSettings }
				isBusy={ savingSettings }
				onClick={ onClick }
			>
				{ __( 'Save Settings', 'compassionate-comments' ) }
			</Button>

			{ savedSettings &&
				<span className="comcon-admin-main__save-notice is-success">
					<Dashicon icon="saved" />
					{ __( 'Saved.', 'compassionate-comments' ) }
				</span>
			}

			{ saveSettingsError &&
				<span className="comcon-admin-main__save-notice is-error">
					<Dashicon icon="warning" />
					{ sprintf(
						__( 'Error: %s.', 'compassionate-comments' ),
						saveSettingsError
					) }
				</span>
			}
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
export function SettingsView( props ) {
	const {
		handleApiKeyChange, handleStoreCommentsChange, handleSaveSettings, handlePerspectiveSensitivityChange,
		perspectiveApiKey, perspectiveApiKeyError, perspectiveStoreComments, perspectiveSensitivity,
		savedSettings, saveSettingsError, savingSettings, siteIsPublic,
	} = props;

	return (
		<Fragment>
			<div id="comcon-admin__settings">
				<ApiKey
					apiKey={ perspectiveApiKey }
					apiKeyError={ perspectiveApiKeyError }
					onChange={ handleApiKeyChange }
				/>

				<Sensitivity
					sensitivity={ perspectiveSensitivity }
					onChange={ handlePerspectiveSensitivityChange }
				/>

				{ siteIsPublic &&
					<StoreComments
						checked={ perspectiveStoreComments }
						onChange={ handleStoreCommentsChange }
					/>
				}

				{ ! siteIsPublic &&
					<StoreCommentsDisabled />
				}
			</div>

			<SaveButton
				onClick={ handleSaveSettings }
				savedSettings={ savedSettings }
				saveSettingsError={ saveSettingsError }
				savingSettings={ savingSettings }
			/>
		</Fragment>
	);
}
