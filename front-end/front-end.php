<?php

namespace Compassionate_Comments\Front_End;
use function Compassionate_Comments\Common\add_inline_script;
use WP_Post;

add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_assets' );
add_filter( 'preprocess_comment', __NAMESPACE__ . '\inject_comment_meta' );


/**
 * Enqueue the script and stylesheet.
 */
function enqueue_assets() {
	global $post;

	if ( ! $post instanceof WP_Post || 'open' !== $post->comment_status ) {
		return;
	}

	wp_enqueue_style(
		'compassionate-comments-front',
		plugins_url( 'front-end.css', __FILE__ ),
		array( 'wp-components' ),
		COMCON_VERSION
	);

	wp_enqueue_script(
		'compassionate-comments-front',
		plugins_url( 'build/front-end.js', __DIR__ ),
		json_decode( file_get_contents( dirname( __DIR__ ) . '/build/front-end.deps.json' ) ),
		COMCON_VERSION,
		true // Not needed until submit comment form, so no reason to block rendering.
	);

	add_inline_script( 'compassionate-comments-front' );
}

/**
 * Inject comment metadata from `$_POST` into the database.
 *
 * @todo Refactor this if https://core.trac.wordpress.org/ticket/47447 is merged.
 *
 * @param array $comment_data
 *
 * @return array
 */
function inject_comment_meta( $comment_data ) {
	/*
	 * Arguably at this point we should parse the timestamp out of the key, and store it in the `meta_value` field
	 * instead, so that all values would have a consistent `meta_key` of `comcon_perspective_score`. That would
	 * allow querying them with `meta_key = 'comcon_perspective_score'` rather than `meta_key LIKE
	 * 'comcon_perspective_score%'`.
	 *
	 * However, `wp_insert_comment` assigns the `meta_key` based on the key in the `comment_meta` array, and can't
	 * arrays can't have duplicate keys, so we couldn't have multiple entries per comment like we need.
	 *
	 * There are some benefits of doing it this way too, like being able to do efficient meta queries against
	 * `meta_value`, since it only contains the score. We can always parse the timestamp out of the key name if
	 * needed, or even query against it with something like `WHERE SUBSTRING( meta_key, 25 ) > 1559320234144`.
	 */
	if ( ! empty( $_POST[ 'comcon_comment_meta'] ) ) {
		foreach ( $_POST['comcon_comment_meta'] as $key => $value ) {
			if ( 'comcon_perspective_score_' === substr( $key, 0, 25 ) ) {
				$comment_data['comment_meta'][ $key ] = (float) $value;
			}
		}
	}

	return $comment_data;
}
