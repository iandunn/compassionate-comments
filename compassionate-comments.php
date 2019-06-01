<?php

namespace Compassionate_Comments;
use WP_Post;

// Admin
add_action( 'admin_init',            __NAMESPACE__ . '\register_settings' );
add_action( 'rest_api_init',         __NAMESPACE__ . '\register_settings' );
add_action( 'admin_menu',            __NAMESPACE__ . '\register_admin_pages' );
add_action( 'admin_notices',         __NAMESPACE__ . '\notify_key_missing' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_assets' );

// Front end
add_action( 'wp_enqueue_scripts', __NAMESPACE__ . '\enqueue_front_end_assets' );
add_filter( 'preprocess_comment', __NAMESPACE__ . '\inject_comment_meta' );


// todo make sure aware of what ^ gets done for each context (admin, front end, api, etc), don't want to loaod unnecessary stuff

// register admin screen, settings, etc

// if this gets long, probably split it into admin and front-end files, update namespace

// todo if api key not defined, then show warning on plugins, link to settings page

// todo
function register_settings() {
	register_setting(
		'compassionate-comments',
		'comcon_perspective_api_key',
		array(
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
		)
	);

	register_setting(
		'compassionate-comments',
		'comcon_toxic_sensitivity',
		array(
			'type'              => 'integer',
			'show_in_rest'      => true,
			'sanitize_callback' => 'absint',
		)
	);

	register_setting(
		'compassionate-comments',
		'comcon_store_comments',
		array(
			'type'              => 'boolean',
			'show_in_rest'      => true,
			'sanitize_callback' => 'wp_validate_boolean',
		)
	);

	// todo want to set default values here? i guess it doesn't really matter b/c only ever using this to update, not read, but still
}

//todo
function register_admin_pages() {
	add_submenu_page(
		'options-general.php',
		__( 'Compassionate Comments', 'compassionate-comments' ),
		__( 'Compassionate Comments', 'compassionate-comments' ),
		'manage_options',
		'compassionate-comments',
		__NAMESPACE__ . '\render_settings_page'
	);
}

// todo
function notify_key_missing() {
	if ( ! in_array( get_current_screen()->base, array( 'plugins', 'edit-comments' ) ) ) {
		return;
	}

	if ( ! empty( get_option( 'comcon_perspective_api_key' ) )) {
		return;
	}

	?>

	<div class="notice notice-error">
		<p>
			<?php echo wp_kses_data( sprintf(
				__( 'Compassionate Comments will not start working until you <a href="%s">configure an API key</a>.', 'compassionate-comments' ),
				admin_url( 'options-general.php?page=compassionate-comments' )
			) ); ?>
		</p>
	</div>

	<?php
}

//todo
// need to render something from server just in case js broken
function render_settings_page() {
	// todo i18n everything

	?>

	<div class="wrap">
		<h1>
			<?php _e( 'Compassionate Comments', 'compassionate-comments' ); ?>
		</h1>

		<form method="post" action="options.php">
			<div id="compassionate-comments-settings">
				<p>Loading...</p>

				<p>If this takes more than a few seconds, there may be some JavaScript errors in your browser console.</p>

				<!-- todo is it good to give user technical details like that? -->
			</div>
		</form>
	</div>

	<?php
}

// todo
function enqueue_admin_assets() {
	if ( 'settings_page_compassionate-comments' !== get_current_screen()->base ) {
		return;
	}

	wp_enqueue_script(
		'compassionate-comments-admin',
		plugins_url( 'build/admin.js', __FILE__ ),
		json_decode( file_get_contents( __DIR__ . '/build/admin.deps.json' ) ),
		// todo why does ^ contain wp-polyfill? is it automatic, or b/c i triggered it w/ something?
		COMCON_VERSION,
		true // Not needed until submit comment form, so no reason to block rendering.
	);

	wp_enqueue_style(
		'compassionate-comments-admin',
		plugins_url( 'css/admin.css', __FILE__ ),
		array( 'wp-components' ),
		COMCON_VERSION
	);

	add_inline_script( 'compassionate-comments-admin' );
}


// todo
function enqueue_front_end_assets() {
	global $post;

	if ( ! $post instanceof WP_Post || 'open' !== $post->comment_status ) {
		return;
		// todo test
	}

	wp_enqueue_style(
		'compassionate-comments-front',
		plugins_url( 'css/front-end.css', __FILE__ ),
		array( 'wp-components' ), // todo anything else?
		COMCON_VERSION
	);

	wp_enqueue_script(
		'compassionate-comments-front',
		plugins_url( 'build/front-end.js', __FILE__ ),
		json_decode( file_get_contents( __DIR__ . '/build/front-end.deps.json' ) ),
		COMCON_VERSION,
		true // Not needed until submit comment form, so no reason to block rendering.
	);

	add_inline_script( 'compassionate-comments-front' );
}

// todo
function add_inline_script( $handle ) {
	global $post;

	$options = array(
		'perspectiveApiKey' => get_option( 'comcon_perspective_api_key', '' ),
		'toxicSensitivity'  => get_option( 'comcon_toxic_sensitivity', 40 ),
		'postIsPublic'      => $post instanceof WP_Post && 'publish' === $post->post_status,
		'isTestEnvironment' => is_test_environment(),

		/*
		 * In Multisite, Core keeps site-specific option in sync with `wp_blogs.public`, so checking this
		 * works for both single-site and Multisite.
		 */
		'siteIsPublic' => (bool) get_option( 'blog_public' ),


		// todo api request needs language, but need to map wp locale to language codes that google uses
			// need to include glotpress locales.php via submodule with sparse checkout? or via svn?
			// w.org directory doesn't support svn:externals, would need in git repo anyway
			// api expects "A list of ISO 631-1 two-letter language codes "

		// does perspective api support all languages? can detect is language isn't detected and show error on settings screen, and have front end return early?
		/*
		 * Production Model	Supported Languages
			TOXICITY	en, fr, es
			SEVERE_TOXICITY	en, fr, es
		 */

		// add something to readme about supported languages

		// show warning in admin and disable plugin entirely if language not supported?
			// don't disable b/c comments can be written in different language, but maybe show warning so that admin is aware

		// can get those automatically though? don't wanna hardcode a safelist that'll get outdated and block people from using it even though the api supports its
			// maybe just show warning in admin screen if blog locate doesn't match one of the hardcoded list, instead of blocking?
			// it's possible to have the blog locale set to english but commenters writing in spanish, etc
	);

	// If the entire site is private, ask Perspective to never store comments.
	$options['storeComments'] = $options['siteIsPublic'] ? get_option( 'comcon_store_comments', true ) : false;

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

// todo
// todo refactor this if https://core.trac.wordpress.org/ticket/47447 is merged
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
