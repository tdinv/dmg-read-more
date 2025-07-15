<?php
/**
 * Plugin Name:       DMG Read More
 * Description:       Adds a custom DMG Read More Gutenberg Block as well as a new CLI Command to find the block
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       dmg-read-more
 *
 * @package           create-block
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Register
 *
 * These files prepare the plugin for us and register any needed elements
 * Could use composer to autoLoad but keeping it lightweight
 */

require_once 'app/register/block.php';
require_once 'app/register/command.php';