# TODO

## MVP


### Launch

* install on iandunn.name even though don't need it, just to dogfood / catch bugs
	* wtf it's working on iandunn.name but not fightingforalostcause.net, not obvious why
		maybe need to clone git repo to production so can troubleshoot, or at least step through debug in browser dev tools

* Post about it on your blog
	* just about the plugin concept/launch, not the react stuff, that'll be separate post
	* https://iandunn.name/wordpress/wp-admin/post.php?post=2436&action=edit




## Next Minor

* can't restrict key b/c request comes from browser and referrer can be forged, so gonna have to proxy through rest api endpoint :(
	proxying will hide the key, but if return score then it's just giving abusers indirect access to api key, instead of direct access
	so need to only return `nudge: true/false` to tell ui whether to show the warning or not
	but then how do you log the scores?
		maybe js generates a random "commentSessionId" every page load, and includes that in rest api request
		then store scores in transient keyed to that commentSessionId. (different transient for each Id)
		when comment is submitted, include commentSessionId, and pull the associated scores from transient and add them to comment meta
		then delete the transient
		seems like that'll work, but not very elegant. maybe wait a day or two and see if come up with a better idea

* add some "saved" text or something next to save button, b/c happens so fast that user doesn't have any visual feedback
	make it fade out after 5-10 seconds? - css animation?
	or just have permenant "saved x minutess ago" that updates real time?
		https://github.com/WordPress/gutenberg/issues/14486
		just use Moment directly for now, but leave comment to replace with ^ when it's available, for future-proofing
	or have a permenant "there are unsaved changes" / "all changes have been saved" thing? - tried that and it became a rabbit hole, so probably do one of the simpler options above
		mostly complex b/c have to track original state after last save if want it to be perfect.
			otherwise making change and undoing it would say it's unsaved, even though it's actually the asme values
			could have simpler version though that just tracks if a change has been made, that would cover most cases, just wouldn't be perfect, maybe good enough, at least for first version, can iterate later to improve if think of a simple way

* have a stats dashboard that shows the impact of the plugin
	--this is already stated on the `stats` branch--
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

* Switch to SASS once wp-scripts supports it
	* https://github.com/WordPress/gutenberg/issues/14801
	* Can do it now like wordcamp.org did? See https://github.com/WordPress/wordcamp.org/pull/157/



## Future

Impact could be on UX _or_ devex.

### High Impact / Low Effort

* fix minor todos left in code, or move them to this file if not worth fixing now

* Add option to force moderation for any comments that were submitted with scores above sensitivity threshhold

* show comment scores on the comments list and/or when editing individiaual comments
	* make color red if it's above the sensitivity threshhold, and green if it's below
	* update faq about prompt not showing, so that it says to compare the value of the comment on comment screen to the sensitivity setting

* show avatar of person replying to, to put human face on it?
	make text say something about remembering that there's a human being on the other side, don't say something you wouldn't say to their face
	or would that backfire? how to make it not awkward?

* Update list of supported languages every ~6 months.


### High Impact / High Effort

* Add way to report false positives back to Perspective, if they accept that kind of feedback
	* > Users can leverage the [...] ‘SuggestCommentScore’ method to submit corrections to improve Perspective over time.
	* maybe Let commenters report false positives too
	* but how to take into account that different sites have different sensitivity?

* let user choose between perspective and tensorflow toxicity, so have offline/private option
	* after tensorflow added, Propose for anon p2

* reduce bundle sizes

* Warn admin when Perspective quota exceeded
	* Those are currently available in the Cloud Console, but not (easily) accessible via API
	* https://github.com/conversationai/perspectiveapi/issues/6

* Consider sending `context` request param in future, once it actually impacts the score

* Consider using React Context instead of passing props/state down several layers, but that seems pretty clunky in its own right too.


### Low Impact / Low Effort

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

* Instead of showing sample comments in the Sensitivity card, show the site's real comments.
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

* add comment score to email notification


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
