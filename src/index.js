// Let's register the block
import { registerBlockType } from '@wordpress/blocks';

// Dependencies
import Edit from './edit';
import save from './save';
import metadata from './block.json';

// Let's define the block that we want to register
registerBlockType( metadata.name, {
	icon: 'insert more',
	/**
	 * @see ./edit.js
	 */
	edit: Edit,
	/**
	 * @see ./save.js
	 */
	save,
} );
