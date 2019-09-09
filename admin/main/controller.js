/**
 * WordPress dependencies
 */
import { Component }                 from '@wordpress/element';
import { addQueryArgs, getQueryArg } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { MainView } from './view';


export class Admin extends Component {
	constructor( props ) {
		super( props );

		// If they've already configured the plugin, then it's more likely that they want to see stats than change settings again.
		const defaultTab   = props.perspectiveApiKey ? 'impact' : 'settings';
		const requestedTab = getQueryArg( window.location.href, 'tab' );
		const currentTab   = requestedTab || defaultTab;

		this.state = { currentTab };

		Admin.pushTabState( currentTab );

		// todo use experimental syntax for this to avoid these calls
		this.switchTab = this.switchTab.bind( this );
	}

	/**
	 * Initialization that can't be done until the component is mounted.
	 */
	componentDidMount() {
		// This won't exist until the component has been mounted.
		this.tabContainer = document.getElementById( 'comcon-admin__navigation-tabs' );

		this.tabContainer.addEventListener( 'click', this.switchTab );
	}

	/**
	 * Clean up things before the component is unmounted.
	 */
	componentWillUnmount() {
		this.tabContainer.removeEventListener( 'click', this.switchTab );
	}

	/**
	 * Switch the current tab to the requested one.
	 *
	 * @param {object} event
	 */
	switchTab( event ) {
		event.preventDefault();

		// Don't do anything if they clicked somewhere inside the container that wasn't a link.
		if ( ! event.target.href ) {
			return;
		}

		const tab = getQueryArg( event.target.href, 'tab' );

		this.setState( {
			currentTab : tab,
		} );

		Admin.pushTabState( tab );
	}

	/**
	 * Update the browser's location bar and history when changing to a new tab.
	 *
	 * @param {string} tab
	 */
	static pushTabState( tab ) {
		history.pushState(
			null,
			tab,
			addQueryArgs( window.location.href, { tab } )
		);
	}

	/**
	 * Render the view for the main interface.
	 *
	 * @return {Element}
	 */
	render() {
		const { languageSupported, perspectiveApiKey, perspectiveStoreComments, perspectiveSensitivity, siteIsPublic } = this.props;
		const { currentTab } = this.state;

		return (
			<MainView
				currentTab={ currentTab }
				languageSupported={ languageSupported }
				perspectiveApiKey={ perspectiveApiKey }
				perspectiveStoreComments={ perspectiveStoreComments }
				perspectiveSensitivity={ perspectiveSensitivity }
				siteIsPublic={ siteIsPublic }
			/>
		);
	}
}
