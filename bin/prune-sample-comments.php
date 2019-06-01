<?php

/*
 * Prune the sample comments from the Perspective project down to the minimum data we need for the Settings screen.
 */

namespace Compassionate_Comments\Bin\Prune_Sample_Comments;
use WP_CLI;

defined( 'WP_CLI' ) || die();


/**
 * The script runner.
 *
 * @param string $file
 * @param array $args
 */
function main( $file, $args ) {
	WP_CLI::line( "\nPruning Sample Comments..." );
	WP_CLI::line();

	$output          = '';
	$output_file     = __DIR__ . '/tmp-sample-comments.js';
	$pruned_comments = array();
	$invalid_texts   = array( '#ERROR!', 'Done (talk) (cont)', 'wat up mat can u see this' );

	$handle = fopen( $args[0], "r" );

	if ( $handle === false ) {
		WP_CLI::error( 'Could not open file.' );
	}

	fgetcsv( $handle );  // Shift off the header row.

	do {
		$row         = fgetcsv( $handle );
		$text        = trim( str_replace( array( '"', PHP_EOL ), ' ', $row[1] ) );
		$text        = wp_trim_words( $text, 50, '...' );
		$text_length = strlen( $text );
		$score       = $row[2] * 100; // Score from Toxicity v6 model, converted to user-friendly scale.

		if ( empty( $text ) || in_array( $text, $invalid_texts, true ) ) {
			continue;
		}

		// This is the first time we've encountered this score, so use it as the initial value.
		if ( empty( $pruned_comments[ $score ] ) ) {
			$pruned_comments[ $score ] = $text;
		}

		// Pick the shortest line that is still descriptive, in order to minimize bundle size and make them easy to read.
		// The current text is shorter than the one previous chosen, so make this the new value.
		// Ignore text that is very short, though, since it's not descriptive enough.
		if ( $text_length > 70 && $text_length < strlen( $pruned_comments[ $score ] ) ) {
			$pruned_comments[ $score ] = $text;
		}
	} while( $row !== false );

	fclose( $handle );

	// Fill in gaps.
	for ( $i = 0; $i <= 100; $i++ ) {
		if ( empty( $pruned_comments[ $i ] ) ) {
			$pruned_comments[ $i ] = $pruned_comments[ $i - 1 ];
		}
	}

	ksort( $pruned_comments );

	foreach( $pruned_comments as $score => $comment ) {
		$output .= sprintf( '%d: "%s",' . "\n", $score, $comment );
	}

	file_put_contents( $output_file, $output );

	WP_CLI::line( sprintf(
		"Output array to `bin/%s`. You can now manually merge that into `src/admin/main/sample-comments.js`.",
		basename( $output_file )
	) );

	exit;
}

/**
 * Print usage instructions if the script wasn't called correctly.
 *
 * This is intended for users incorrectly calling it from the command line, as opposed to the `die()` at the start
 * of the file, which is intended to prevent loading directly via an HTTP request.
 *
 * @param string $file
 * @param array $args
 */
function usage( $file, $args ) {
	if ( ! defined( 'WP_CLI' ) || 1 !== count( $args ) ) {
		die(
			str_replace( "\t", '', "
				Usage: wp eval-file prune-sample-comments.php /path/to/sample-comments.csv

				Download sample comments from https://raw.githubusercontent.com/conversationai/perspectiveapi/50ef534ca8d4beb89ae796c1c5bcf83250a13281/example_data/perspective_wikipedia_2k_score_sample_20180829.csv\n"
			)
		);
	}
}

/**
 * @var string $file The filename of the current script
 * @var array  $args The arguments passed to this script from the command line
 */
usage( $file, $args );
main( $file, $args );
