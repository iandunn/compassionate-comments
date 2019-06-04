<?php defined( 'WPINC' ) || die(); ?>

<div class="error">
	<p>
		<?php esc_html_e( "Compassionate Comments error: Your environment doesn't meet all of the system requirements listed below.", 'compassionate-comments' ); ?>
	</p>

	<ul class="ul-disc">
		<li>
			<strong>
				<?php echo esc_html( sprintf(
					__( 'PHP %s+', 'compassionate-comments' ),
					esc_html( COMCON_REQUIRED_PHP_VERSION )
				) ); ?>
			</strong>

			<em>
				<?php echo esc_html( sprintf(
					__( "(You're running version %s)", 'compassionate-comments' ),
					PHP_VERSION
				) ); ?>
			</em>
		</li>

		<li>
			<strong>
				<?php echo esc_html( sprintf(
					__( 'WordPress %s+', 'compassionate-comments' ),
					COMCON_REQUIRED_WP_VERSION
				) ); ?>
			</strong>

			<em>
				<?php echo esc_html( sprintf(
					__( "(You're running version %s)", 'compassionate-comments' ),
					$wp_version
				) ); ?>
			</em>
		</li>
	</ul>

	<p>
		<?php wp_kses_data( sprintf(
			__( 'If you need to upgrade your version of PHP you can ask your hosting company for assistance, and if you need help upgrading WordPress you can refer to <a href="%s">the Codex</a>.', 'compassionate-comments' ),
			'http://codex.wordpress.org/Upgrading_WordPress'
		) ); ?>
	</p>
</div>
