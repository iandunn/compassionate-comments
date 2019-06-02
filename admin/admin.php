<?php

namespace Compassionate_Comments\Admin;
use function Compassionate_Comments\Common\add_inline_script;

add_action( 'admin_init',            __NAMESPACE__ . '\register_settings' );
add_action( 'rest_api_init',         __NAMESPACE__ . '\register_settings' );
add_action( 'admin_menu',            __NAMESPACE__ . '\register_pages' );
add_action( 'admin_notices',         __NAMESPACE__ . '\notify_key_missing' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_assets' );


// todo
function register_settings() {
	register_setting(
		'compassionate-comments',
		'comcon_perspective_api_key',
		array(
			'type'              => 'string',
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'default'           => '',
		)
	);

	register_setting(
		'compassionate-comments',
		'comcon_perspective_sensitivity',
		array(
			'type'              => 'integer',
			'show_in_rest'      => true,
			'sanitize_callback' => 'absint',
			'default'           => 40,
		)
	);

	register_setting(
		'compassionate-comments',
		'comcon_perspective_store_comments',
		array(
			'type'              => 'boolean',
			'show_in_rest'      => true,
			'sanitize_callback' => 'wp_validate_boolean',
			'default'           => true,
		)
	);
}

//todo
function register_pages() {
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
	?>

	<div class="wrap">
		<h1>
			<?php _e( 'Compassionate Comments', 'compassionate-comments' ); ?>
		</h1>

		<form method="post" action="options.php">
			<div id="compassionate-comments-settings">
				<p><?php _e( 'Loading...', 'compassionate-comments' ); ?></p>

				<p><?php _e( 'If this takes more than a few seconds, there may be some JavaScript errors in your browser console.', 'compassionate-comments' ); ?></p>

				<!-- todo is it good to give user technical details like that? -->
			</div>
		</form>
	</div>

	<?php
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

// todo
function enqueue_assets() {
	if ( 'settings_page_compassionate-comments' !== get_current_screen()->base ) {
		return;
	}

	wp_enqueue_style(
		'compassionate-comments-admin',
		plugins_url( 'admin.css', __FILE__ ),
		array( 'wp-components' ),
		COMCON_VERSION
	);

	wp_enqueue_script(
		'compassionate-comments-admin',
		plugins_url( 'build/admin.js', __DIR__ ),
		json_decode( file_get_contents( dirname( __DIR__ ) . '/build/admin.deps.json' ) ),
		// todo why does ^ contain wp-polyfill? is it automatic, or b/c i triggered it w/ something?
		COMCON_VERSION,
		true // Not needed until submit comment form, so no reason to block rendering.
	);

	add_inline_script( 'compassionate-comments-admin' );
}
