/**
 * WordPress dependencies
 */
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

	saveSettings() {
		this.setState( { savingSettings: true }, () => {
			// apiFetch call to update settings based on this.state
		} );
	}

	render() {
		const { perspectiveApiKey, savingSettings, storeComments, toxicSensitivity } = this.state;

		// todo consider using Context for this instead of passing it down all the time, but that seems pretty clunky in its own right

		return (
			<MainView
				handleApiKeyChange={ perspectiveApiKey => this.setState( { perspectiveApiKey } ) }
				handleSaveSettings={ () => this.saveSettings() }
				handleStoreCommentsChange={ storeComments => this.setState( { storeComments } ) }
				handleToxicSensitivityChange={ toxicSensitivity => this.setState( { toxicSensitivity } ) }

				perspectiveApiKey={ perspectiveApiKey }
				savingSettings={ savingSettings }
				storeComments={ storeComments }
				toxicSensitivity={ toxicSensitivity }
			/>
		);
	}
}
