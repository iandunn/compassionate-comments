# Compassionate Comments

Why do we have tools to check our spelling, but not to check if we're being kind to each other?

This is a simple proof-of-concept for a WordPress plugin that would test the intent of a comment before it's submitted. If the tool detects that the author is being mean, it will encourage them to think twice, and give them a chance to fix their comment before submitting it.

The inspiration for this comes from Tristan Harris' TED talk about [designing technology to reflect human values](https://www.youtube.com/watch?v=D55ctBYF3AY).


## Example

![Screenshot of a user being warned that their comment is mean](./screenshot.png)


## Minimum Viable Product

This is just a rough proof of concept with a small blacklist of negative words. An actual MVP would require a natural language processor to detect snark, sarcasm, insults, etc.

A quick search shows that some interesting research and projects have been done in this area:

* [The Sarcasm Detector](http://www.thesarcasmdetector.com/about/) tool
* [Detecting Insults in Social Commentary](https://www.kaggle.com/c/detecting-insults-in-social-commentary) challenge on Kaggle
* [Abusive Language Detection in Online User Content](http://www2016.net/proceedings/proceedings/p145.pdf) paper
* [Detecting Insults in Social Commentary](https://www.overleaf.com/articles/detecting-insults-in-social-commentary/gkvrrwryjxhr/viewer.pdf) paper


## TODO

* Integrate with [Perspective API](https://www.perspectiveapi.com/) to get real analysis
* Improve the design
* Release 0.1 into WordPress.org plugin repository
* Post about it on your blog, [WP Tavern comments](https://wptavern.com/googles-new-perspective-project-filters-online-comments-based-on-toxicity), etc


## Potential Features

* Give the user live feedback as they're writing the comment, rather than waiting until they're done?
	* Can see good things about both. Maybe more effective to let them write it first, get it out of their system, then they'll be more open to rephrasing it?
	* Or maybe if they've already gone to the trouble of writing it they'll be more resistant to throwing it away?
	* Maybe offer both modes, and collect stats on each so the admin can see which works best for their community
* If do both modes above, then maybe have opt-in option to send anonymous stats to me so I can see what's working for everyone, and use that to drive features for the plugin.
	* Could have REST API endpoint on iandunn.name to collect the stats. Anonymized site ID, mode, success rate, etc.
	* Could also have a page that displays the results and provides the raw data
	* How to prevent a malicious person sending fake data to the endpoint to distort the results, though? How do other similar systems handle that?
* Give the user details on what type of problem was detecting (sarcasm, insults, etc), and highlight the words that were flagged
* Give admins an option to automatically moderate any comments that are flagged
* Ability to report false positive. Maybe only show if click 'send anyways '
* Let users filter what level of comments they want to see, kind of like slashdot's 1-5 score
