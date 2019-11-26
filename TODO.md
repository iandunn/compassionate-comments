# TODO

## Launch

* Post about it on your blog
	* just about the plugin concept/launch, not the react stuff, that'll be separate post
	* https://iandunn.name/wordpress/wp-admin/post.php?post=2436&action=edit


## Next Minor

* have a stats dashboard that shows the impact of the plugin
	* ____need to think through consequences of all of the below before doing anything, because changes might destroy ability to do some of it if done in wrong order___

	* track data of comments before plugin was installed
		maybe have a `comcon_history` option like this:
		array(
			'installed' => [id of the newest comment when the plugin was first installed. have to populate _before_ retroroactively score old comments, b/c detect it based on absence of scores]
				keep in mind that comments can have empty score even after plugin installed, if api key error, js error on page from other plugin, not supported language, etc
			`sensitivyt_50` => [id of newest comment when the sensitivity was changed to 50]
			`sensitivyt_60` => [id of newest comment when the sensitivity was changed to 60]
			`sensitivyt_40` => [id of newest comment when the sensitivity was changed to 40]

			// would probably want different keys than that
		)
		maybe have different options for `installed` and sensitivity changes; or maybe just treat `installed` as the first `sensitivity change` with it being set to the default sensitivity

	* track data of when sensitivity changed?
		stats will be distorted when sensitivity changes, so maybe need to track that somehow and only show stats for comments rated w/ the current sensitivity or something?
		maybe when saving sensitivity, store the newest comment_id, and only show stats for comments since then
		would need to let user know only showing stats since last sensitivity change, otherwise they'd be confused why not seeing for older comments
		might only affect some stats

	* track data of comments since plugin was installed

		look at `commentmeta` table
			% comments that scored high enough to trigger warning, but submitted anyway
				this will be distorted if change sensitivity level, so maybe only analyzie comments since the last change in level
			% comments that scored high enough to trigger warning, then resubmitted w/ a lower score
				also show average delta between first score and second (e.g., "of commenters that chose to make comment more kind, the toxicity level decreased from average of 64% to average of 33%")
		average toxicity score across all comments
		average score of comments below sensitivity threshold, and avg of those above it

	display data
		use some nifty js data visualization thingy

	add screenshot of stats menu
		update screenshot of settings menu too

* lint php

* add file extentions to `import` statements, for explicitness
	do for QNI too

* use shorter format instead destructuring props
	`function( { foo, bar } )`
	probably can't do for ones that reference this.props and this.state?


* rename index.js files to be more meaningful, like from `card/index.js` to `card/card.js` and `sensitivity/index.js` to `sensitivity/sensitivity.js` ?
	* would be better devex b/c ide tabs not all the same, or prefixed w/ directory name
	* i don't think wp-scripts will care, but test
	* maybe not "idiomatic", but like most things, that means it's better



* fix bug where it works on iandunn.name but not fightingforalostcause.net, not obvious why
	maybe need to clone git repo to production so can troubleshoot, or at least step through debug in browser dev tools

* can't restrict key b/c request comes from browser and referrer can be forged, so gonna have to proxy through rest api endpoint :(
	proxying will hide the key, but if return score then it's just giving abusers indirect access to api key, instead of direct access
	so need to only return `nudge: true/false` to tell ui whether to show the warning or not
	but then how do you log the scores?
		maybe js generates a random "commentSessionId" every page load, and includes that in rest api request
		then store scores in transient keyed to that commentSessionId. (different transient for each Id)
		when comment is submitted, include commentSessionId, and pull the associated scores from transient and add them to comment meta
		then delete the transient
		seems like that'll work, but not very elegant. maybe wait a day or two and see if come up with a better idea

* maybe use https://reactjs.org/docs/react-api.html#reactmemo and https://reactjs.org/docs/react-api.html#reactpurecomponent ?
	* be careful b/c it's only a shallow compare


* default to settings tab if `testApiKey()` fails
	if landing on impact page, but then test reveals error in key, would want to show error notice that key has problem
	otherwise they'll never see the notice on the settings page
	will require soem refactoring
	that'd be http request, so would need to go in didmount()

* let user choose between perspective and tensorflow toxicity, so have offline/private option
	* after tensorflow added, Propose for anon p2. setup demo so he can get a feel for it


## Future

Impact could be on UX _or_ devex.


### High Impact / Low Effort

* fix minor todos left in code, or move them to this file if not worth fixing now

* Add option to force moderation for any comments that were submitted with scores above sensitivity threshhold

* show comment scores when editing individiaual comments
	* make color red if it's above the sensitivity threshhold, and green if it's below
	* update the faq entry about the prompt not showing; make it say to compare the value of the comment on the comment screen to the sensitivity score in the settings screen
		* is ^ not necessary b/c we have example comments showing in sensitivity setting?

* show avatar of person replying to, to put human face on it?
	make text say something about remembering that there's a human being on the other side, don't say something you wouldn't say to their face
	or would that backfire? how to make it not awkward?

* Update list of supported languages every ~6 months.

* Replace custom Card component with G version once 5.4 comes out

* fix i18n crap?
	https://github.com/WordPress/gutenberg/issues/9846#issuecomment-555583946

* switch <Fragment> to <>
	* looks like it works fine in 5.0, so don't need to bump required version

### High Impact / High Effort

* Come up with better default toxic comment examples for sesntitivity setting
	 instead of using the ones from wikipedia, find some public database like new york times or something
	 use plugin to score those, and then save in sample-comments.js

* Add way to report false positives back to Perspective, if they accept that kind of feedback
	* > Users can leverage the [...] ‘SuggestCommentScore’ method to submit corrections to improve Perspective over time.
	* maybe Let commenters report false positives too
	* but how to take into account that different sites have different sensitivity?

* reduce bundle sizes

* Warn admin when Perspective quota exceeded
	* Those are currently available in the Cloud Console, but not (easily) accessible via API
	* https://github.com/conversationai/perspectiveapi/issues/6

* Consider sending persepective api `context` request param in future, once it actually impacts the score

* Use more composition to reduce prop drilling
* Then consider using React Context + Hooks to get rid of the remaining ones
	see QNI for notes

* Override default toxic comment examples with real comments from the current site
	* that'd help identify a better default sensitivity when they first install plugin
	* but maybe wouldn't have time to rank them before they go to the settings screen?
	* would at least help if they come back later to tweak it
	* would have to retroactively analyize old comments and score them
		* would need to have 1 for every single value from 1-100 ?
		* or could maybe use the sample comments as a base, but overwrite individual values w/ real comments where they exist
			* e.g., [1] - sample, [2] - real, [3] - sample, [4] - sample, [5] - real
		* retroactivly analyzing could come in handy for stats as well, to show things like avg toxicity before and after install plugin
	* privacy considerations? prob not b/c already agreeing to send? but maybe edge cases
		* well, should use `doNotTrack` to be cautious, b/c it might score them before user's had a chance to learn about setting and enable `doNotTrack`

	* would need to somehow track which comments were scored before the plugin was active, and which after
		* otherwise it'd heavily distort stats, because it'd look like nobody edited their comment after seeing the prompt
		* maybe just an option that has the highest comment_id when the plugin was activated
			* doesn't take into account that plugin could be activated/deactivate at times, but good enough
	* add stat to show average toxicity before installed plugin, and average toxicity after
		* need to wait until X comments after install, to have large enough sample size to draw meaningful conclusions

* look at using https://reactjs.org/docs/hooks-state.html ?

### Low Impact / Low Effort

* comment list toxicity column - maybe make color red if it's above the sensitivity threshhold, and green if it's below

* Add a cron job to test the API key periodically (once a week, maybe daily) and email the admin if it's not working
	* Otherwise if it stops working the plugin will fail silently and comments will just be accepted without analysis

* have setting to not send comments to Perspective at all for private sites/posts, rather than sending them with `doNotTrack`

* lower api request timeout to 15 seconds b/c user won't wait 30?
	* https://stackoverflow.com/questions/46946380/fetch-api-request-timeout
	* https://davidwalsh.name/fetch-timeout

* maybe have gradations, rather than just toxic or not toxic?
	* e.g., at 40% user is shown warning, at 80% user is blocked from publishing until edits to below 80%?

* Add option to not scan comments of logged-in users
	* maybe also let choose which roles get scanned

* add comment score to email notification

* if changing tabs and have changed settings, but haven't saved yet, then trigger a warning that browsing away
	* quick glance seems like there ways to do this are pretty hacky, but there may be a good one that i missed


### Low Impact / High Effort


* Give the comment author details on what type of problem was detecting (sarcasm, insults, etc), and highlight the words that were flagged
	* look at `spanScores` in api response, need to enable `spanAnnotations` option in api requst

* Give the comment author live feedback as they're writing the comment, rather than waiting until they're done?
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

* create video similar to QNI, link to both readmes

* add e2e tests
	* this should be low effort, but the tools still suck and there aren't any examples
	* check out https://github.com/eventespresso/event-espresso-core (unit tests) and https://github.com/google/site-kit-wp (e2e tests) as examples
	* they still require custom config, but use wp-scripts
	* if those work, add them to the gutenberg-examples issue, along w/ this
