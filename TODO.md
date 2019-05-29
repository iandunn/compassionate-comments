# TODO

## MVP

* convert front-end to react
	need custom webpack config to handle

* Integrate with [Perspective API](https://www.perspectiveapi.com/) to get real analysis
	or toxicity -- https://github.com/tensorflow/tfjs-models/tree/master/toxicity
	toxicity is local, so private and faster
		er, wait, is it local?
	perspective is remote, so slower, but more accurate
	there's already another w.org plugin that uses Toxicity, so use perspective

	* add back-end settings screen in react to add api key
		export existing options during page render to save time
		use rest api to save options
		er, maybe just use existing Discussions settings? that's all needed now
		will need more in future if add additional options though, and want practice w/ wp-admin screen

		when click save button, 
			disable button
			show "saving..."
				show "saved x min ago [green checkmark icon]" next to it
				show "failed to save"
			re-enable save button
		when change option, clear the "saved/failed" message
		make all of ^ a reusable component, b/c will want to copy for other plugins
		see if anything similar exists in G, but not likely

	if api key not defined, then show warning on options screen, plugins screen, maybe other places
	don't try to moderate

	* maybe enable experimental models
		prob not, at least for MVP
		https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#models

* allow admin to define how sensitive they want to be
	* show note that this wont retroactively reassigned previous comments
	* maybe show comment scores on the comments list or when editing individiaual comments  -prob future enhancement

* option to not store comments on G servers
	* default value should be to not store if blog is private

* fix any todos left in code

* Improve the design
* update readme.md
* update readme.txt



### Stretch goals

* show avatar of person replying to, to put human face on it?
	make text say something about remembering that there's a human being on the other side, don't say something you wouldn't say to their face
	or would that backfire? how to make it not awkward?

### Launch

* add to hackerone top targets
	* remove from exclusions
* pin to github profile
* Release 0.1 into WordPress.org plugin repository
	* setup svn:ignores for things that are only in the dev
* Post about it on your blog, [WP Tavern comments](https://wptavern.com/googles-new-perspective-project-filters-online-comments-based-on-toxicity), etc
	* there's also https://wordpress.org/plugins/serious-toxic-comments/, which uses TensorFlow's Toxicity model and blocks rather than gives a chance to rephrase
	* also https://wordpress.org/plugins/sift-ninja/
* post fyi on a8c discussion


## Future

* When comment is flagged but reporter submits without editing
	* Show an icon in All Comments list (etc) to indicate that
	* Add option to let admins automatically moderate these comments
* also add commentmeta when comment was flaged but edited and no longer flagged, show different type of icon in comments list

* have a test button on the wp-admin to help users know if credentials setup correctly
	* send an existing comment (if there are some) or a fallback hardcoded comment
	* show successful results or error

* maybe have gradations, rather than just toxic or not toxic?
	* e.g., at 40% user is shown warning, at 80% user is blocked from publishing until edits to below 80%?

* Add way to report false positives back to Perspective, if they accept that kind of feedback
	* > Users can leverage the [...] ‘SuggestCommentScore’ method to submit corrections to improve Perspective over time.

* Give the user details on what type of problem was detecting (sarcasm, insults, etc), and highlight the words that were flagged
	* look at `spanScores` in api response, need to enable `spanAnnotations` option in api requst

* Give the user live feedback as they're writing the comment, rather than waiting until they're done?
	* Can see good things about both. Maybe more effective to let them write it first, get it out of their system, then they'll be more open to rephrasing it?
	* Or maybe if they've already gone to the trouble of writing it they'll be more resistant to throwing it away?
	* Maybe offer both modes, and collect stats on each so the admin can see which works best for their community
* If do both modes above, then maybe have opt-in option to send anonymous stats to me so I can see what's working for everyone, and use that to drive features for the plugin.
	* Could have REST API endpoint on iandunn.name to collect the stats. Anonymized site ID, mode, success rate, etc.
	* Could also have a page that displays the results and provides the raw data
	* How to prevent a malicious person sending fake data to the endpoint to distort the results, though? How do other similar systems handle that?

* Let users filter what level of comments they want to see, kind of like slashdot's 1-5 score
