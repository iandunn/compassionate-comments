<?php

namespace Compassionate_Comments\Admin;
use function Compassionate_Comments\Common\add_inline_script;

add_action( 'admin_menu',            __NAMESPACE__ . '\register_pages' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_assets' );

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
