<?php

namespace Compassionate_Comments;

add_action( 'admin_init',            __NAMESPACE__ . '\register_settings' );
add_action( 'rest_api_init',         __NAMESPACE__ . '\register_settings' );
add_action( 'admin_menu',            __NAMESPACE__ . '\register_admin_pages' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_admin_assets' );
add_action( 'wp_enqueue_scripts',    __NAMESPACE__ . '\enqueue_front_end_assets' );


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
	// todo return early if all comments are disabled
		// can't detect that, b/c setting just controls default, and they could be enabled on individual pages?

	// check build size of css and js, make sure not too bad

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
	$script_data = sprintf(
		'var comconOptions = %s;',
		wp_json_encode( array(
			'perspectiveApiKey' => get_option( 'comcon_perspective_api_key' ),
			'toxicSensitivity'  => get_option( 'comcon_toxic_sensitivity', 40 ),
			'storeComments'     => get_option( 'comcon_store_comments', true ),


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

			// can get those automatically though? don't wanna hardcode a safelist that'll get outdated and block people from using it even though the api supports its
				// maybe just show warning in admin screen if blog locate doesn't match one of the hardcoded list, instead of blocking?
				// it's possible to have the blog locale set to english but commenters writing in spanish, etc
		) )
	);

	wp_add_inline_script( $handle, $script_data, 'before' );
}
