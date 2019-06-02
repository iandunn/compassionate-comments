<?php

namespace Compassionate_Comments\Common;
use WP_Post;


// todo
function add_inline_script( $handle ) {
	global $post;

	/*
	 * For the `TOXICITY` model as of 5/31/2019.
	 *
	 * See https://github.com/conversationai/perspectiveapi/blob/master/api_reference.md#production-toxicity-models
	 */
	$supported_languages = array( 'en', 'es', 'fr' );

	$options = array(
		'perspectiveApiKey'      => get_option( 'comcon_perspective_api_key' ),
		'perspectiveSensitivity' => get_option( 'comcon_perspective_sensitivity'),
		'postIsPublic'           => $post instanceof WP_Post && 'publish' === $post->post_status,
		'isTestEnvironment'      => is_test_environment(),

		/*
		 * This is fuzzy, since it's common for the site locale to be in English even when the `post_content` and
		 * comments are in another language, and it's also possible to have the site locale in an unsupported
		 * language and have comments in a supported language. It's simple and good enough for most cases, though.
		 */
		'languageSupported' => in_array( substr( get_locale(), 0, 2 ), $supported_languages ),

		/*
		 * In Multisite, Core keeps site-specific option in sync with `wp_blogs.public`, so checking this
		 * works for both single-site and Multisite.
		 */
		'siteIsPublic' => (bool) get_option( 'blog_public' ),
	);

	// If the entire site is private, ask Perspective to never store comments.
	$options['perspectiveStoreComments'] = $options['siteIsPublic'] ? get_option( 'comcon_perspective_store_comments' ) : false;

	// todo rename "options" to something more accurate, but what? "data" is too vague.
	$options = apply_filters( 'comcon_options', $options, $handle, $post );

	$script_data = sprintf(
		'var comconOptions = %s;',
		wp_json_encode( $options )
	);

	wp_add_inline_script( $handle, $script_data, 'before' );
}

//todo
function is_test_environment() {
	$hostname_parts   = explode( '.', wp_parse_url( site_url(), PHP_URL_HOST ) );
	$top_level_domain = end( $hostname_parts );
	$test_tlds        = array( 'test', 'localhost', 'local' );

	return in_array( $top_level_domain, $test_tlds, true );
}
