/**
 * WordPress dependencies
 */
import { Fragment }     from '@wordpress/element';
import { __ }           from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { Impact }                         from './../impact';
import { SettingsController as Settings } from './../settings/controller';


/**
 * Render the menu of tabs for different admin pages.
 *
 * @todo Gutenberg's `TabPanel` might be a better fit for this in the future; reusing a native component would be
 * much better than reinventing the wheel, especially with an older Core design. It doesn't current work well for
 * this use case, though. It uses a button instead of a link, which is semantically wrong in this situation. The
 * styling also needs a lot of work to match what's desired here, and it doesn't seem like there's an easy way to
 * apply existing styles to do that, instead of having to write a bunch myself.
 *
 * @todo Dig into reusing it so that you understand what it'd take, and then open an issue to request that it be
 * abstracted enough to be useful in situations like this.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
function NavigationTabs( { currentTab } ) {
	const tabs = [
		{
			slug  : 'impact',
			label : __( 'Impact', 'compassionate-comments' ),
		},

		{
			slug  : 'settings',
			label : __( 'Settings', 'compassionate-comments' ),
		},
	];

	return (
		// The classes apply the styles from `wp-admin/theme-install.php`.
		<div id="comcon-admin__navigation-tabs" className="wp-filter">
			<ul className="filter-links">
				{
					tabs.map( tab => {
						const href    = addQueryArgs( window.location.href, { tab : tab.slug } );
						const current = currentTab === tab.slug;

						return (
							<li key={ tab.slug} >
								<a
									href={ href }
									className={    current ? 'current' : '' }
									aria-current={ current ? 'page'    : 'false' }
								>
									{ tab.label }
								</a>
							</li>
						);
					} )
				}
			</ul>
		</div>
	);
}

/**
 * Render the main admin view.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
export function MainView( props ) {
	const { currentTab, languageSupported, perspectiveApiKey, perspectiveStoreComments, perspectiveSensitivity, siteIsPublic } = props;

	return (
		<Fragment>
			<p>
				{ __(
					'This plugin checks the intent of a comment before it\'s submitted. If the author is being rude or disrespectful, it will encourage them to think twice, and give them a chance to rephrase their comment to be more kind before they submit it.',
					'compassionate-comments'
				) }
			</p>

			<p>
				{ /* Intentionally not i18n'd yet because of Gutenberg security issue. See Toxic component for details. */ }
				Google's <a href="https://www.perspectiveapi.com/">Perspective API</a> is used to determine the characteristics of the comment, which means that all comments will be sent to their servers for analysis.
			</p>

			{ ! languageSupported &&
				<Fragment>
					<div className="notice notice-warning inline">
						<p>
							{ __(
								'The Perspective API can only analyze comments written in English, Spanish, and French. Comments written in other languages will be accepted without any analysis or content warnings.',
								'compassionate-comments'
							) }
						</p>
					</div>
				</Fragment>
			}

			<NavigationTabs currentTab={ currentTab } />

			{ 'settings' === currentTab &&
				<Settings
					perspectiveApiKey={ perspectiveApiKey }
					perspectiveStoreComments={ perspectiveStoreComments }
					perspectiveSensitivity={ perspectiveSensitivity }
					siteIsPublic={ siteIsPublic }
				/>
			}

			{ 'impact' === currentTab &&
				<Impact />
			}
		</Fragment>
	);
}
