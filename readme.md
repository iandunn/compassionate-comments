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