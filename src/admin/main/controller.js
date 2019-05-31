/**
 * WordPress dependencies
 */
import { apiFetch }  from '@wordpress/api-fetch';
import { Component } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { MainView } from './view';


/**
 * Manage the state for the main interface.
 */
export class MainController extends Component {
	constructor( props ) {
		super( props );

		const { perspectiveApiKey, storeComments, toxicSensitivity } = props;

		this.state = {
			savingSettings: false,
			perspectiveApiKey,
			storeComments,
			toxicSensitivity,
		};

		// ^ feels weird b/c then you have props.sensitivity and state.sensitivity and they don't match
			// maybe that's ok though?
			// or maybe this is a smell that i'm doing something wrong?
	}

	//todo
	saveSettings() {
		this.setState( { savingSettings: true }, () => {
			const { apiFetch } = wp;
				// todo this shouldn't be necessary since imported above, but otherwise it's undefined
			const { perspectiveApiKey, storeComments, toxicSensitivity } = this.state;

			const fetchParams = {
				path   : '/wp/v2/settings',
				method : 'PUT',
				data   : {
					'comcon_perspective_api_key' : perspectiveApiKey,
					'comcon_toxic_sensitivity'   : toxicSensitivity,
					'comcon_store_comments'      : storeComments,
				}
			};

			apiFetch( fetchParams ).then( data => {
				// what to do here? nothing? can just skip this then?
				// oh, probably update the state.lastupdated thingy

			} ).catch( error => {
				console.error( `Compassionate Comments error: ${error.data.status} ${error.code}: ${error.message}` );
				// todo is it possible that error will ever just be a string rather than this object?

			} ).finally( () => {
				this.setState( { savingSettings: false } );
			} );
		} );
	}

	render() {
		const { perspectiveApiKey, savingSettings, storeComments, toxicSensitivity } = this.state;

		// todo consider using Context for this instead of passing it down all the time, but that seems pretty clunky in its own right

		return (
			<MainView
				handleApiKeyChange={           perspectiveApiKey => this.setState( { perspectiveApiKey } ) }
				handleStoreCommentsChange={    storeComments     => this.setState( { storeComments     } ) }
				handleToxicSensitivityChange={ toxicSensitivity  => this.setState( { toxicSensitivity  } ) }
				handleSaveSettings={ () => this.saveSettings() }

				perspectiveApiKey={ perspectiveApiKey }
				savingSettings={ savingSettings }
				storeComments={ storeComments }
				toxicSensitivity={ toxicSensitivity }
			/>
		);
	}
}
