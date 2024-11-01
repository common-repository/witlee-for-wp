<?php

/**
 *
 * @link              https://wpalchemists.com
 * @since             1.0.0
 * @package           Witlee_For_Wp
 *
 * @wordpress-plugin
 * Plugin Name:       Witlee for WP
 * Plugin URI:        http://witlee.com/
 * Description:       Easily display Witlee information on your WordPress site.
 * Version:           1.2.2
 * Author:            Morgan Kay, Drew Schulz
 * Author URI:        https://witlee.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       witlee-for-wp
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-witlee-for-wp.php';

define( 'WITLEE_API_URL', 'https://api.witlee.com/v1/' );

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_witlee_for_wp() {

	$plugin = new Witlee_For_Wp();
	$plugin->run();

}
run_witlee_for_wp();

require_once( plugin_dir_path( __FILE__ ) . 'public/class-witlee-template.php' );
add_action( 'plugins_loaded', array( 'Witlee_Template_Plugin', 'get_instance' ) );

function main_url() {
	return "http://shop.witlee.com";
}

function add_query_vars($aVars) {
	$aVars[] = "witlee_image";
	return $aVars;
}
function add_rewrite_rules($aRules) {
	$aNewRules = array('store/([^/]+)/?$' => 'index.php?pagename=store&witlee_product=$matches[1]');
	$aRules = $aNewRules + $aRules;
	return $aRules;
}
add_filter('rewrite_rules_array', 'add_rewrite_rules');
add_filter('query_vars', 'add_query_vars');

function witlee_header_hook() {
	global $post;
	$page_id = $post->ID;
	$options = (array) get_option( 'witlee' );
	if ($page_id == $options['witlee_page']) {
		$script = "<script>";
		$script .= " var wp_witlee_uuid = '" . $options['witlee_user'] . "';";
		$script .= " var wp_witlee_theme = '" . $options['witlee_theme'] . "';";
		$script .= " var wp_witlee_embed = true;";
		if ($options['witlee_sticky']) {
			$sticky = $options['witlee_sticky'];
		} else {
			$sticky = "";
		}
		$script .= " var wp_witlee_sticky = '" . $sticky . "';";
		$script .= "</script>";
		echo $script;

		$url = main_url();
		// only activated when used with separate plugin not provided here.
		wp_enqueue_style( 'witlee-style', 'https://cdn.witlee.com/modules/app.css' );
	}
}
add_action('wp_head', 'witlee_header_hook');

function load_wtl_loader() {
    wp_enqueue_script( 'wtl_ltf_loader', 'https://cdn.witlee.com/link2fly/dist/js/wtl-ltf-loader.js' );
}
add_action( 'wp_enqueue_scripts', 'load_wtl_loader' );

function witlee_content_hook($content) {
	global $post;
	$page_id = $post->ID;
	$options = (array) get_option( 'witlee' );
	$html = '';
	if ($page_id == $options['witlee_page']) {
		$url = main_url();
		$html .= '
<div id="wp-witlee" style="position: relative" ng-app="Witlee" class="ng-scope">
  <!-- used only with the store-plugin -->
  <script src="https://cdn.witlee.com/modules/vendor.js"></script>
  <script src="https://cdn.witlee.com/modules/scripts.js"></script>

<nav>
  <nav-bar></nav-bar>
</nav>
<ui-view></ui-view>
<back-to-top></back-to-top>
</div>';
		return $html;
	}
	else {
	    return $content;
	}

}
add_filter('the_content', 'witlee_content_hook');
