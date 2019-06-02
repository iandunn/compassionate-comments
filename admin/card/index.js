/**
 * WordPress dependencies
 */
import { withInstanceId, compose } from '@wordpress/compose';

/**
 * Render a card.
 *
 * This basically mimics a ModalFrame, since that's pretty close to a generic card already.
 *
 * @todo remove this when/if https://github.com/WordPress/gutenberg/issues/15921 is resolved.
 *
 * @param {Array} props
 *
 * @return {Element}
 */
function Card( props ) {
	const { children, instanceId, title } = props;

	// todo really need aria-labelledby? probably, but make sure you understand
		// if not, could get rid of the compose/instanceid bloat

	return (
		<div className="comcon-components__card" aria-labelledby={ `components-modal-header-${ instanceId }` }>
			<h2 id={ `comcon-components__card-header-${ instanceId }` } className="comcon-components__card-header">
				{ title }
			</h2>

			<div className="comcon-components__card-content">
				{ children }
			</div>
		</div>
	);
}

const ComposedCard = compose( withInstanceId )( Card );
export { ComposedCard as Card };
