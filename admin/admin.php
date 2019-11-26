<?php

namespace Compassionate_Comments\Admin;
use function Compassionate_Comments\Common\add_inline_script;
use NumberFormatter;

add_action( 'admin_menu',            __NAMESPACE__ . '\register_pages' );
add_action( 'admin_enqueue_scripts', __NAMESPACE__ . '\enqueue_assets' );
add_filter( 'manage_edit-comments_columns', __NAMESPACE__ . '\add_comment_list_columns' );
add_action( 'manage_comments_custom_column', __NAMESPACE__ . '\render_comment_list_columns', 10, 2 );


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
		plugins_url( 'build/admin.min.css', __DIR__ ),
		array( 'wp-components' ),
		COMCON_VERSION
	);

	wp_enqueue_script(
		'compassionate-comments-admin',
		plugins_url( 'build/admin.min.js', __DIR__ ),
		json_decode( file_get_contents( dirname( __DIR__ ) . '/build/admin.min.deps.json' ) ),
		COMCON_VERSION,
		true // Not needed until submit comment form, so no reason to block rendering.
	);

	add_inline_script( 'compassionate-comments-admin' );
}

/**
 * Add custom columns to the list table on the Comments screen.
 *
 * @param array $columns
 *
 * @return array
 */
function add_comment_list_columns( $columns ) {
	// Insert the custom column in the middle of the default columns.
	$columns = array_merge(
		array_slice( $columns, 0, 3, true ),
		array( 'toxicity' => __( 'Toxicity', 'compassionate-comments' ) ),
		array_slice( $columns, 3, PHP_INT_MAX, true ) // INT_MAX is a shortcut to avoid counting the exact number of items that should be pulled.
	);

	return $columns;
}

/**
 * Render the entries our custom columns on the Comments screen.
 *
 * @param string $column_name
 * @param int    $comment_id
 */
function render_comment_list_columns( $column_name, $comment_id ) {
	$scores     = array();
	$key_prefix = 'comcon_perspective_score_';

	if ( 'toxicity' !== $column_name ) {
		return;
	}

	/*
	 * Having the timestamp in the key name is a bit of a pain in this situation, but it's intentional, because
	 * there are tradeoffs; see `inject_comment_meta()`.
	 */
	$meta_entries = get_comment_meta( $comment_id );

	foreach ( $meta_entries as $name => $value ) {
		// Ignore other meta keys.
		if ( $key_prefix !== substr( $name, 0, strlen( $key_prefix ) ) ) {
			continue;
		}

		$scores[] = round( floatval( $value[0] ) * 100 ); // Convert to user-friendly percentage.
	}

	switch( count( $scores ) ) {
		case 0:
			// Do nothing.
			break;

		case 1:
			echo esc_html( $scores[0] . '%' );
			break;

		default:
			$final_score = array_slice( $scores, count( $scores ) - 1, 1 )[0];
			?>

			<details>
				<summary>
					<?php echo esc_html( $final_score . '%' ); ?>
				</summary>

				<ul>
					<?php foreach ( $scores as $index => $score ) : ?>
						<li>
							<?php

							$locale    = 'en_US';    // todo get current wp locale, but convert to ISO or whatever format they expect. Need to bundle a copy of locales.php?
							$formatter = new NumberFormatter( $locale, NumberFormatter::ORDINAL );

							printf(
								'%s version: %d%%',	// todo i18n.
								esc_html( $formatter->format( $index + 1 ) ),
								absint( $score )
							);

							?>
						</li>
					<?php endforeach; ?>
				</ul>
			</details>

			<?php
			break;
	}
}
