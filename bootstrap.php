<?php

/*
 * Plugin Name: Compassionate Comments
 * Plugin URI:  https://wordpress.org/plugins/compassionate-comments/
 * Description: Encourages commenters to re-phrase toxic comments to be kind instead.
 * Version:     0.1
 * Author:      Ian Dunn
 * Author URI:  https://iandunn.name
 */

defined( 'WPINC' ) || die();

define( 'COMCON_VERSION',              '0.1' );
define( 'COMCON_REQUIRED_PHP_VERSION', '5.6' );  // Because of WordPress minimum requirements.
define( 'COMCON_REQUIRED_WP_VERSION',  '5.0' );  // Because of Gutenberg components.


/**
 * Checks if the system requirements are met.
 *
 * @return bool True if system requirements are met, false if not
 */
function comcon_requirements_met() {
	global $wp_version;

	if ( version_compare( PHP_VERSION, COMCON_REQUIRED_PHP_VERSION, '<' ) ) {
		return false;
	}

	if ( version_compare( $wp_version, COMCON_REQUIRED_WP_VERSION, '<' ) ) {
		return false;
	}

	return true;
}

/**
 * Prints an error that the system requirements weren't met.
 */
function comcon_requirements_error() {
	global $wp_version;

	require_once( dirname( __FILE__ ) . '/admin/requirements-error.php' );
}

/*
 * Check requirements and load the main class
 *
 * The main program needs to be in a separate file that only gets loaded if the plugin requirements are met.
 * Otherwise older PHP installations could crash when trying to parse it.
 */
if ( comcon_requirements_met() ) {
	require_once( dirname( __FILE__ ) . '/common/common.php' );

	/*
	 * This isn't really what `wp_is_json_request()` is meant for, but it's the best option until
	 * https://core.trac.wordpress.org/ticket/42061 is resolved.
	 *
	 * @todo Replace with `wp_doing_rest()` (or whatever) once that's available on minimum required WP version.
	 */
	if ( is_admin() || wp_is_json_request() ) {
		require_once( dirname( __FILE__ ) . '/admin/admin.php' );
		require_once( dirname( __FILE__ ) . '/admin/settings/settings.php' );
	} else {
		// todo does ^ guaranttet this this is only front end? not really, what can you check instead?
		// no, it'll load for cron too. what about login?

		require_once( dirname( __FILE__ ) . '/front-end/front-end.php' );
	}
} else {
	add_action( 'admin_notices', 'COMCON_requirements_error' );
}
