/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @param {Object} props            Properties passed to the function.
 * @param {Object} props.attributes Available block attributes.
 *
 * @return {Element} Element to render.
 */
export default function save( { attributes } ) {

	const { postSelection } = attributes;

	const blockProps = useBlockProps.save({
		className: 'dmg-read-more'
	});

	if(postSelection){

		return <p { ...blockProps }>Read More: <a href={postSelection.link} title={postSelection.title.rendered}>{postSelection.title.rendered}</a></p>;

	}

	// This is the default
	return <p { ...blockProps }><small>Select or search for a post in the sidebar to add as a 'Read More' link.</small></p>;
}
