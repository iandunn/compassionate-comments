<?php

namespace Compassionate_Comments\Admin;
use function Compassionate_Comments\Common\add_inline_script;

add_action( 'admin_init',            __NAMESPACE__ . '\register_settings' );
add_action( 'rest_api_init',         __NAMESPACE__ . '\register_settings' );
add_action( 'admin_menu',            __NAMESPACE__ . '\register_pages' );
add_action( 'admin_notices',         __NAMESPACE__ . '\notify_key_missing' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_assets' );


/**
 * Register the settings for the Settings screen and REST API.
 */
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

/**
 * Register the wp-admin pages.
 */
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

/**
 * Render the initial markup for the Settings screen.
 *
 * Once JavaScript loads, the content will be replaced with the React view.
 */
function render_settings_page() {
	// todo move this to a view file? maybe main/view.php ?
		// no b/c mainview is rendered into a part of this.
	// maybe just admin/wrap.php or admin/container.php or something like that.
	?>

	<div class="wrap">
		<h1>
			<?php esc_html_e( 'Compassionate Comments', 'compassionate-comments' ); ?>
		</h1>

		<form>
			<div id="comcon-admin">
				<p>
					<?php esc_html_e( 'Loading...', 'compassionate-comments' ); ?>
				</p>

				<p>
					<?php esc_html_e(
						'If this takes more than a few seconds, there may be some JavaScript errors in your browser console.',
						'compassionate-comments'
					); ?>
				</p>

				<?php // todo it's probably not best practice to give user technical details like that? but what else to tell them? ?>
			</div>
		</form>
	</div>

	<?php
}

/**
 * Display an admin notice on the Plugins/Comments screens when the API key is not set.
 */
function notify_key_missing() {
	if ( ! in_array( get_current_screen()->base, array( 'plugins', 'edit-comments' ), true ) ) {
		return;
	}

	if ( ! empty( get_option( 'comcon_perspective_api_key' ) ) ) {
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

/**
 * Enqueue the script and stylesheet.
 */
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
		COMCON_VERSION,
		true // Not needed until submit comment form, so no reason to block rendering.
	);

	add_inline_script( 'compassionate-comments-admin' );
}
