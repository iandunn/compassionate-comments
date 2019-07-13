/**
 * WordPress dependencies
 */
import { apiFetch }  from '@wordpress/api-fetch';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MainView }     from './view';
import { consoleError } from '../../common/common';


/**
 * Manage the state and logic for the main interface.
 */
export class MainController extends Component {
	constructor( props ) {
		super( props );

		const { perspectiveApiKey, perspectiveStoreComments, perspectiveSensitivity } = props;

		this.state = {
			savingSettings : false,
			perspectiveApiKey,
			perspectiveStoreComments,
			perspectiveSensitivity,
		};

		// todo ^ feels weird b/c then you have props.sensitivity and state.sensitivity and they don't match
			// maybe that's ok though?
			// or maybe this is a smell that i'm doing something wrong?
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
				// what to do here? nothing? can just skip this then?

			} ).catch( error => {
				consoleError( error );

			} ).finally( () => {
				this.setState( { savingSettings: false } );
			} );
		} );
	}

	render() {
		const { languageSupported, siteIsPublic } = this.props;
		const { perspectiveApiKey, savingSettings, perspectiveStoreComments, perspectiveSensitivity } = this.state;

		return (
			<MainView
				handleApiKeyChange={                 perspectiveApiKey        => this.setState( { perspectiveApiKey        } ) }
				handleStoreCommentsChange={          perspectiveStoreComments => this.setState( { perspectiveStoreComments } ) }
				handlePerspectiveSensitivityChange={ perspectiveSensitivity   => this.setState( { perspectiveSensitivity   } ) }
				handleSaveSettings={ () => this.saveSettings() }

				languageSupported={ languageSupported }
				perspectiveApiKey={ perspectiveApiKey }
				savingSettings={ savingSettings }
				perspectiveStoreComments={ perspectiveStoreComments }
				siteIsPublic={ siteIsPublic }
				perspectiveSensitivity={ perspectiveSensitivity }
			/>
		);
	}
}
