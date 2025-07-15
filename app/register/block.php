<?php

/**
 * Block
 *
 * Adds/regsiters the custom block and or any you may want to add to the plugin
 *
 * PHP Version 8
 *
 * @category Register
 * @package  DMGReadMore
 * @license  http://www.gnu.org/copyleft/gpl.html GNU General Public License
 */

function create_block_dmg_read_more_init() {
	register_block_type( WP_PLUGIN_DIR . '/dmg-read-more' . '/build' );
}

add_action( 'init', 'create_block_dmg_read_more_init' );