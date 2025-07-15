<?php
/**
 * PHP file to use when rendering the block type on the server to show on the front end.
 *
 * The following variables are exposed to the file:
 *     $attributes (array): The block attributes.
 *     $content (string): The block default content.
 *     $block (WP_Block): The block instance.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 */

if( isset($attributes['postSelection']) ){
	$block_content = '<p ' . get_block_wrapper_attributes() . '>Read More: <a href="'. $attributes['postSelection']['link'] .'" title="'. $attributes['postSelection']['title']['rendered'] .'">'. $attributes['postSelection']['title']['rendered'] .'</a></p>';
} else {
	$block_content = null;
}

echo wp_kses_post( $block_content );
