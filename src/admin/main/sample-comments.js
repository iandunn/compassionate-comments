/*
 * These are sample comments pulled from Wikipedia discussions and scored by Perspective based on their toxicity.
 *
 * Needless to say, many of them are disgustingly racist, insulting, obnoxious, etc.
 *
 * They're used on the Settings screen when administrators change the `sensitivity` setting, so that they can
 * understand what the number they choose means, and set a level that's appropriate for their context.
 *
 * Source: https://github.com/conversationai/perspectiveapi/blob/50ef534/example_data/perspective_wikipedia_2k_score_sample_20180829.csv
 */

export const sampleComments = {
	// todo populate from csv
		// choose the shortest one for each score, b/c that's better for UX/reading and for performance/bundle size

	// todo scores go from 0 to 99, not 1 to 100?
		// user-friendly version seems like 0 to 100 would make more sense than 0 to 99? maybe 100 is possible but just not represented in sample data? could just copy 99

	99: "racist",
	71: "dumber",
	70: "dumb",
	69: "not as dumb"
};
