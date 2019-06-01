# TODO

## MVP

* maybe move compassionatecomments.php to `src` folder, so there isn't any real code in the root folder?
	* odd to have php in "js" folder, but it's not named "js", it's named "source". but "source" as opposed to "build", and php isn't built (thank God).
	* precedence in gutenberg dynamic blocks w/ php render

* fix any todos left in code

* Improve the design
	* update screenshot
	* look at https://woocommerce.github.io/woocommerce-admin/#/?id=dev-docs for inspiration
* update readme.md
* update readme.txt



### Stretch goals

* show avatar of person replying to, to put human face on it?
	make text say something about remembering that there's a human being on the other side, don't say something you wouldn't say to their face
	or would that backfire? how to make it not awkward?

* reduce bundle sizes


### Launch

* add to hackerone top targets
	* remove from exclusions
* add release date to readme.txt
* Release 0.1 into WordPress.org plugin repository
	* setup svn:ignores for things that are only in the dev
	* add screenshots and banner assets
	* delete screenshot from git repo and link to w.org CDN instead
	* create video similar to QNI, link to both readmes - nice to have, not blocker
* Post about it on your blog, [WP Tavern comments](https://wptavern.com/googles-new-perspective-project-filters-online-comments-based-on-toxicity), etc
	* there's also https://wordpress.org/plugins/serious-toxic-comments/, which uses TensorFlow's Toxicity model and blocks rather than gives a chance to rephrase
	* also https://wordpress.org/plugins/sift-ninja/
* post fyi on a8c discussion
* propose for all the Make blogs?
	* propse to make/comm first, then if works well propose for others
		* ask andrea for gut check first, b/c power dynamic / conflict of interest
	* set api key for whole network via filter, store in config
	* disable for systems and security sites
* let jjj know might be something interesting for bbpress, but Serious Toxic Comments plugin might be better fit b/c don't need remote API


## Future

### High Impact and/or Low Effort

* Add option to force moderation for any comments that were submitted with scores above sensitivity threshhold

* have a test button on the wp-admin to help users know if credentials setup correctly
	* send an existing comment (if there are some) or a fallback hardcoded comment
		* probably set donotstore to true so that test comment doesn't get stored and distort Perspective's data
	* show successful results or error
	* probaly want to share the code between front and back ends at this point

* show comment scores on the comments list and/or when editing individiaual comments
	* make color red if it's above the sensitivity threshhold, and green if it's below

* Update list of supported languages every ~6 months.

* Switch to SASS once wp-scripts supports it
	* https://github.com/WordPress/gutenberg/issues/14801


### Low Impact and/or High Effort

* have setting to not send comments to Perspective at all for private sites/posts, rather than sending them with `doNotTrack`

* Add way to report false positives back to Perspective, if they accept that kind of feedback
	* > Users can leverage the [...] ‘SuggestCommentScore’ method to submit corrections to improve Perspective over time.
	* maybe Let commenters report false positives too
	* but how to take into account that different sites have different sensitivity?

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
	* maybe not, since the Tune chrome extension already exists
	* but maybe worth it so that users don't have to install something

* lower api request timeout to 15 seconds b/c user won't wait 30?
	* https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
	* https://davidwalsh.name/fetch-timeout

* maybe have gradations, rather than just toxic or not toxic?
	* e.g., at 40% user is shown warning, at 80% user is blocked from publishing until edits to below 80%?

* Add option to not scan comments of logged-in users
	* maybe also let choose which roles get scanned

* Warn admin when Perspective quota exceeded
	* Those are currently available in the Cloud Console, but not (easily) accessible via API
	* https://github.com/conversationai/perspectiveapi/issues/6

* Consider sending `context` request param in future, once it actually impacts the score
