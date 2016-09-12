<?php

/*
Plugin Name: Compassionate Comments
Plugin URI:  https://github.com/iandunn/compassionate-comments
Description: Why do we have tools to check our spelling, but not to check if we're being kind to each other?
Version:     0.1
Author:      Ian Dunn
Author URI:  https://iandunn.name
License:     GPL v2 or later
*/

namespace Compassionate_Comments;

add_action( 'wp_enqueue_scripts',      __NAMESPACE__ . '\enqueue_assets' );
add_action( 'wp_print_footer_scripts', __NAMESPACE__ . '\render_views'   );

function is_relevant_screen() {
	return true;
}

function enqueue_assets() {
	wp_register_script(
		'compassionate-comments',
		plugins_url( 'compassionate-comments.js', __FILE__ ),
		array( 'jquery' ),
		1,
		true
	);

	wp_register_style(
		'compassionate-comments',
		plugins_url( 'compassionate-comments.css', __FILE__ ),
		array(),
		1
	);

	if ( ! is_relevant_screen() ) {
		return;
	}

	wp_enqueue_script( 'compassionate-comments' );
	wp_enqueue_style(  'compassionate-comments' );
}

function render_views() {
	require_once( __DIR__ . '/views/compassion-nudge.php' );
}
