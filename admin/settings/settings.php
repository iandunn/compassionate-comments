<?php

namespace Compassionate_Comments\Admin\Settings;

add_action( 'admin_init',    __NAMESPACE__ . '\register_settings' );
add_action( 'rest_api_init', __NAMESPACE__ . '\register_settings' );
add_action( 'admin_notices', __NAMESPACE__ . '\notify_key_missing' );

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
