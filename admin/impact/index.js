/*

maybe rename this file to have main controller & view?

 have a stats dashboard that shows the impact of the plugin
	Add tab for."impact" that shows stats
	make default tab when API key entered, otherwise settings is default
	Use page router so that history API is set and real deep links work
	use some nifty js data visualization thingy
	look at `commentmeta` table
		% comments that scored high enough to trigger warning, but submitted anyway
			this will be distorted if change sensitivity level, so maybe only analyzie comments since the last change in level
		% comments that scored high enough to trigger warning, then resubmitted w/ a lower score
			also show average delta between first score and second (e.g., "of commenters that chose to make comment more kind, the toxicity level decreased from average of 64% to average of 33%")
	average toxicity score across all comments
	average score of comments below sensitivity threshold, and avg of those above it
	stats will be distorted when sensitivity changes, so maybe need to track that somehow and only show stats for comments rated w/ the current sensitivity or something?
		maybe when saving sensitivity, store the newest comment_id, and only show stats for comments since then
		would need to let user know only showing stats since last sensitivity change, otherwise they'd be confused why not seeing for older comments
		might only affect some stats

	add screenshot of stats menu
		update screenshot of settings menu too
*/

/**
 * WordPress dependencies
 */
import { Fragment } from '@wordpress/element';
import { __ }       from '@wordpress/i18n';

/**
 * Internal dependencies
 */
//import { Card }        from '../card';


/**
 * Render the view for the main interface.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
export function Impact( props ) {
	// this should be a stateful controller w/ a separeate view file just like settings? if so rename file etc
		// maybe also do it anyway to match impact.php?

	const {
		foo
	} = props;


	return (
		<Fragment>
			hey i've got charts n stuff!
		</Fragment>
	);
}
