<?php

/**
 * The file that defines the core plugin class
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 *
 * @link       https://wpalchemists.com
 * @since      1.0.0
 *
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * @since      1.0.0
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/includes
 * @author     Morgan Kay <morgan@wpalchemists.com>
 */
class Witlee_For_Wp {

	/**
	 * The loader that's responsible for maintaining and registering all hooks that power
	 * the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      Witlee_For_Wp_Loader    $loader    Maintains and registers all hooks for the plugin.
	 */
	protected $loader;

	/**
	 * The unique identifier of this plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $plugin_name    The string used to uniquely identify this plugin.
	 */
	protected $plugin_name;

	/**
	 * The current version of the plugin.
	 *
	 * @since    1.0.0
	 * @access   protected
	 * @var      string    $version    The current version of the plugin.
	 */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 *
	 * Set the plugin name and the plugin version that can be used throughout the plugin.
	 * Load the dependencies, define the locale, and set the hooks for the admin area and
	 * the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function __construct() {

		$this->plugin_name = 'witlee-for-wp';
		$this->version = '1.1.3';

		$this->load_dependencies();
		$this->set_locale();
		$this->define_admin_hooks();
		$this->define_public_hooks();

	}

	/**
	 * Load the required dependencies for this plugin.
	 *
	 * Include the following files that make up the plugin:
	 *
	 * - Witlee_For_Wp_Loader. Orchestrates the hooks of the plugin.
	 * - Witlee_For_Wp_i18n. Defines internationalization functionality.
	 * - Witlee_For_Wp_Admin. Defines all hooks for the admin area.
	 * - Witlee_For_Wp_Public. Defines all hooks for the public side of the site.
	 *
	 * Create an instance of the loader which will be used to register the hooks
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function load_dependencies() {

		/**
		 * The class responsible for orchestrating the actions and filters of the
		 * core plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-witlee-for-wp-loader.php';

		/**
		 * The class responsible for defining internationalization functionality
		 * of the plugin.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/class-witlee-for-wp-i18n.php';

		/**
		 * The class responsible for the options page.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-witlee-options.php';

		/**
		 * The class responsible for defining all actions that occur in the admin area.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'admin/class-witlee-for-wp-admin.php';

		/**
		 * The class responsible for defining all actions that occur in the public-facing
		 * side of the site.
		 */
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'public/class-witlee-for-wp-public.php';

		$this->loader = new Witlee_For_Wp_Loader();

	}

	/**
	 * Define the locale for this plugin for internationalization.
	 *
	 * Uses the Witlee_For_Wp_i18n class in order to set the domain and to register the hook
	 * with WordPress.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function set_locale() {

		$plugin_i18n = new Witlee_For_Wp_i18n();

		$this->loader->add_action( 'plugins_loaded', $plugin_i18n, 'load_plugin_textdomain' );

	}

	/**
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_admin_hooks() {

		$plugin_admin = new Witlee_For_Wp_Admin( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_styles' );
		$this->loader->add_action( 'admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts' );

		if( !defined( 'WITLEE_CURRENT_PAGE' ) ) {
			define( 'WITLEE_CURRENT_PAGE', basename( $_SERVER['PHP_SELF'] ) );
		}

		if( in_array( WITLEE_CURRENT_PAGE, array( 'post.php', 'page.php', 'page-new.php', 'post-new.php' ) ) ) {
			$this->loader->add_action( 'media_buttons', $plugin_admin, 'add_witlee_shortcode_button', 11 );
		}

		$this->loader->add_action( 'wp_ajax_modal_content' , $plugin_admin, 'modal_content' );
		$this->loader->add_action( 'wp_ajax_list_imagetiles', $plugin_admin, 'ajax_list_imagetiles' );
		$this->loader->add_action( 'wp_ajax_list_seed_items', $plugin_admin, 'ajax_list_seed_items' );
		$this->loader->add_action( 'wp_ajax_notice_dismissed', $plugin_admin, 'notice_dismissed' );
		$this->loader->add_action( 'wp_ajax_upload_imagetile', $plugin_admin, 'ajax_upload_imagetile' );
		$this->loader->add_action( 'wp_ajax_validate_token', $plugin_admin, 'validate_token' );


		$this->loader->add_action( 'admin_notices', $plugin_admin, 'notice_turn_on_tracking' );

	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 */
	private function define_public_hooks() {

		$plugin_public = new Witlee_For_Wp_Public( $this->get_plugin_name(), $this->get_version() );

		add_shortcode( 'witlee', array( $plugin_public, 'witlee_shortcode' ) );
		add_action( 'wp_footer', array( $plugin_public, 'include_google_analytics' ) );

		add_action( 'wp_enqueue_scripts', array( $plugin_public, 'enqueue_scripts' ) );

		$this->loader->add_action( 'wp_ajax_nopriv_ajax_get_items', $this, 'ajax_get_items' );
	    $this->loader->add_action( 'wp_ajax_ajax_get_items', $this, 'ajax_get_items' );

		$this->loader->add_action( 'wp_ajax_nopriv_ajax_get_session', $this, 'ajax_get_session' );
		$this->loader->add_action( 'wp_ajax_ajax_get_session', $this, 'ajax_get_session' );

	}

	public function ajax_get_items() {

		$plugin_public = new Witlee_For_Wp_Public( $this->get_plugin_name(), $this->get_version() );
		$plugin_public->ajax_get_list();

		die();

	}

	public function ajax_get_session() {

		$plugin_public = new Witlee_For_Wp_Public( $this->get_plugin_name(), $this->get_version() );
		$plugin_public->get_session();

		die();

	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 *
	 * @since    1.0.0
	 */
	public function run() {
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @since     1.0.0
	 * @return    Witlee_For_Wp_Loader    Orchestrates the hooks of the plugin.
	 */
	public function get_loader() {
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}



}
