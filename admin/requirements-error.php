<?php defined( 'WPINC' ) or die; ?>

<div class="error">
	<p><?php _e( "Compassionate Comments error: Your environment doesn't meet all of the system requirements listed below.", 'compassionate-comments' ); ?></p>

	<ul class="ul-disc">
		<li>
			<strong><?php printf( __( 'PHP %s+', 'compassionate-comments' ), esc_html( COMCON_REQUIRED_PHP_VERSION ) ); ?></strong>
			<em><?php printf( __( "(You're running version %s)", 'compassionate-comments' ), esc_html( PHP_VERSION ) ); ?></em>
		</li>

		<li>
			<strong><?php printf( __( 'WordPress %s+', 'compassionate-comments' ), esc_html( COMCON_REQUIRED_WP_VERSION ) ); ?></strong>
			<em><?php printf( __( "(You're running version %s)", 'compassionate-comments' ), esc_html( $wp_version ) ); ?></em>
		</li>
	</ul>

	<p>
		<?php printf(
			__( 'If you need to upgrade your version of PHP you can ask your hosting company for assistance, and if you need help upgrading WordPress you can refer to <a href="%s">the Codex</a>.', 'compassionate-comments' ),
			'http://codex.wordpress.org/Upgrading_WordPress'
          ); ?>
	</p>
</div>
