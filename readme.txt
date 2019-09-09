=== Compassionate Comments ===
Contributors:      iandunn
Donate link:       http://rethinkwords.com/contribute
Tags:              comments,toxic,moderation,abuse,bullying
Requires at least: 5.0
Requires PHP:      5.6
Tested up to:      5.2
Stable tag:        0.1
License:           GPLv2 or later

Encourages authors of toxic comments to re-phrase them to be more kind instead.


== Description ==

Why do we have tools to check our spelling, but not to check if we're being kind to each other?

This plugin checks the intent of a comment before it's submitted. If the author is being rude or disrespectful, it will encourage them to think twice, and give them a chance to rephrase their comment to be more kind before they submit it.

Google's free [Perspective API](https://www.perspectiveapi.com/) is used to determine the characteristics of the comment, which means that all comments will be sent to their servers for analysis. You can optionally request that they not store your comments for their future research.

The Perspective API can only analyze comments written in English, Spanish, and French. Comments written in other languages will be accepted without any analysis or content warnings.

The inspiration for this comes from Tristan Harris' TED talk about [designing technology to reflect human values](https://www.youtube.com/watch?v=D55ctBYF3AY), and from [ReThink](http://www.rethinkwords.com/).

You can [report bugs and contribute on GitHub](https://github.com/iandunn/compassionate-comments).


== Frequently Asked Questions ==

= Why isn't the prompt showing when I type a rude comment? =

That might be expected behavior, if the comment score is lower than the Sensitivity setting, or if it were written in a language that the API doesn't support. It currently supports English, Spanish, and French.

If the score is higher, try opening your browser's error console, click the `Perserve logs` checkbox, and then submit the rude comment. Check if any errors appear in the console. Also check the Network tab to see if any XHR requests failed.

If you see errors and you're not sure how to fix them, [open a support request](https://wordpress.org/support/plugin/compassionate-comments/) and copy/paste the exact errors there.

Don't forget to delete any test comments you made :)

= How can I edit the JavaScript files? =

Unfortunately modern JavaScript conventions make this more difficult than editing PHP, but there are instructions in [the GitHub repository](https://github.com/iandunn/compassionate-comments).

= Is this plugin secure? =
I've done my best to ensure that it is, but just in case I missed anything [I also offer a security bounty](https://hackerone.com/iandunn-projects/) for any vulnerabilities that can be found and privately disclosed in any of my plugins.


== Screenshots ==

1. The warning a comment author is shown when submitting a toxic comment.
2. The wp-admin settings screen.


== Changelog ==


= v0.1 (2019-06-03) =
* [NEW] Initial release


== Upgrade Notice ==

= 0.1 =
Initial release.
