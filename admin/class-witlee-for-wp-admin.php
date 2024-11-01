<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://wpalchemists.com
 * @since      1.2.2
 *
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/admin
 * @author     Morgan Kay <morgan@wpalchemists.com>
 */
class Witlee_For_Wp_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/witlee-for-wp-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/witlee-for-wp-admin.js', array( 'jquery' ), $this->version, false );
		wp_localize_script( $this->plugin_name, 'witleeadminajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'api_url' => WITLEE_API_URL, 'return_url' => admin_url( 'options-general.php?page=witlee' ) ) );

	}

	/**
	 * If the user has not turned on tracking, display a notice in dashboard
     */
	public function notice_turn_on_tracking() {

		$options = get_option( 'witlee' );
		if( '1' == $options['witlee_tracking'] ) {
			return;
		}

		$dismissed = get_transient( 'witlee-tracking-notice' );
		if( 'dismissed' == $dismissed ) {
			return;
		}
	}

	/**
	 * AJAX function - if user dismisses tracking notice, set a transient that lasts two weeks
     */
	public function notice_dismissed() {
	    return;
	    /*
		** set_transient( 'witlee-tracking-notice', 'dismissed', 2 * WEEK_IN_SECONDS );
		** $response = get_transient( 'witlee-tracking-notice' );
		** die( $response );
		*/
	}

	/**
	 * Put a button next to the "Add Media" button on content editor
     */
	public function add_witlee_shortcode_button() {
	    return;
	    /**
		* $is_post_edit_page = in_array( WITLEE_CURRENT_PAGE, array( 'post.php', 'page.php', 'page-new.php', 'post-new.php' ) );
		* if( $is_post_edit_page ) {
        *
		*	print sprintf(
		*		'<input type="button" class="button" id="witlee-iframe_modal" value="%1$s" data-content-url="%3$s%2$d">' ,
		*		__( 'Witlee' , 'witlee-for-wp' ) ,
		*		$post->ID ,
		*		admin_url( 'admin-ajax.php?action=modal_content&post_id=' ) );
        *
		*}
		**/
	}

	/**
	 *  AJAX function to load scripts and styles for Witlee shortcode UI modal
     */
	public function modal_content() {
		wp_enqueue_media();

		wp_enqueue_style( 'witlee_modal-content' , plugin_dir_url( __FILE__ ) . 'css/witlee-modal.css' );
		wp_enqueue_script( 'witlee_modal-content' , plugin_dir_url( __FILE__ ) . 'js/witlee-modal.js' , array( 'jquery' ) );
		wp_localize_script( 'witlee_modal-content', 'witleeadminajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ), 'settings_url' => admin_url( 'options-general.php?page=witlee' ) ) );
		include( 'partials/witlee-for-wp-admin-display.php' );
		die();
	}

	/**
	 * Get user's Witlee username
	 *
	 * @return string|false
     */
	public function get_witlee_username() {

		$options = get_option( 'witlee' );

		if( isset( $options['witlee_user'] ) && '' !== $options['witlee_user'] ) {
			return $options['witlee_user'];
		} else {
			return false;
		}

	}

	/**
	 * AJAX function to retrieve image tiles for display in shortcode UI modal
	 *
	 * @param int $i
	 * @return string|void
     */
	public function ajax_list_imagetiles( $i = 1 ) {

		if( isset( $_POST['page'] ) ) {
			$i = $_POST['page'];
		}

		$results = '';

		$influencer = $this->get_witlee_username();

		if( !$influencer ) {
			$results = __( 'Please go to the Witlee settings page and enter in your user ID to select images.', 'witlee-for-wp' );
			die( $results );
		}

		$imagetiles = wp_remote_get( WITLEE_API_URL . 'influencers/' . $influencer . '/new?size=20&page=' . $i , array( 'sslverify' => false ) );

		if( is_wp_error( $imagetiles ) ) {
			$error = __( 'Unable to connect to the Witlee API', 'witlee-for-wp' );
			if( isset( $_POST['action'] ) && 'list_imagetiles' == $_POST['action'] ) {
				die( $error );
			} else {
				return $error;
			}
		} elseif( '404' == $imagetiles['response']['code'] ) {
			$error = '<p class="error-message">' . sprintf( __( 'Unable to find image tiles for user %s.', 'witlee-for-wp' ), $influencer ) . '</p>';
			if( isset( $_POST['action'] ) && 'list_imagetiles' == $_POST['action'] ) {
				die( $error );
			} else {
				return $error;
			}
		} else {
			$result = json_decode( $imagetiles['body'] );
			$items = $result->results;
			if( !empty( $items ) ) {

				foreach( $items as $item ) {
					$results .= '<label>
							<input type="radio" name="witlee_shortcode_imagetile" value="' . $item->id . '">
							<div style="background-image: url(' . $item->imagetile_url . ')"></div>
						</label>';
				}
			} else {
				$results = __( 'No image tiles found.', 'witlee-for-wp' );
			}
		}

		if( isset( $_POST['action'] ) && 'list_imagetiles' == $_POST['action'] ) {
			die( $results );
		} else {
			return $results;
		}
	}

	/**
	 * AJAX function to retrieve seed items to display in shortcode UI modal
     */
	public function ajax_list_seed_items() {

		$results = '';

		$seeds = wp_remote_get( WITLEE_API_URL . 'imagetiles/' . $_POST['imagetile'] , array( 'sslverify' => false ) );

		if( is_wp_error( $seeds ) ) {
			$error = __( 'Unable to connect to the Witlee API', 'witlee-for-wp' );
			die( $error );
		} elseif( '404' == $seeds['response']['code'] ) {
			$error = printf( __( 'Unable to find the image with id %s.', 'witlee-for-wp' ), $_POST['imagetile'] );
			die( $error );
		} else {
			$result = json_decode( $seeds['body'] );
			$items = $result->seeds;
			if( !empty( $items ) ) {
				$i = 0;
				foreach( $items as $item ) {

					$results .= '<label>
							<input type="radio" name="witlee_shortcode_seed" value="' . $item->id . '">
							<div style="background-image: url(' . $item->image_url . ')"></div>
						</label>';
				}
			} else {
				$results = __( 'No seeds found.', 'witlee-for-wp' );
			}
		}

		die( $results );

	}

	/**
	 *  Upload images to Witlee
	 *
	 * @since 1.1.0
     */
	public function ajax_upload_imagetile() {

		$headers = array(
			'Authorization' => 'Token ' . $_POST['token'],
			'x-session' => $_POST['session']
		);

		if( isset( $_POST['attachment']['url'] ) ) {
			$url = $_POST['attachment']['url'];
		} else {
			$results = '<p class="witlee-error error-message">' . __( 'Unable to find image URL', 'witlee-for-wp' ) . '</p>';
			die( $results );
		}

		if( isset( $_POST['attachment']['width'] ) ) {
			$width = $_POST['attachment']['width'];
		} else {
			$width = '';
		}

		if( isset( $_POST['attachment']['height'] ) ) {
			$height = $_POST['attachment']['height'];
		} else {
			$height = '';
		}

		if( isset( $_POST['attachment']['caption'] ) ) {
			$caption = $_POST['attachment']['caption'];
		} else {
			$caption = '';
		}


		$body = array(
			'url' => $url,
			'width' => $width,
			'height' => $height,
			'caption' => $caption,
		);

		$imagetiles = wp_remote_post( WITLEE_API_URL . 'imagetiles', array(
			'headers' => $headers,
			'body' => $body,
			'sslverify' => false
		) );

		$results = array();

		if( 200 !== intval( $imagetiles['response']['code'] ) ) {
			$url = admin_url( 'options-general.php?page=witlee' );
			$results['status'] = 'error';
			$results['html'] = '<div class="error-message">
					<p>' . sprintf( __( 'Unable to authenticate.  Please go to the <a href="%s" target="_parent">Witlee settings page</a> and sign on with Instagram.', 'witlee-for-wp' ), $url ) . '</p>
				</div>';

			wp_send_json($results);
			die();
		}

		$imagetile = json_decode( $imagetiles['body'] );

		$results['status'] = 'success';
		$results['html'] = '<label class="witlee-disabled">
				<input type="radio" value="' . $imagetile->id . '" name="witlee_shortcode_imagetile" disabled>
				<div style="background-image: url(' . $_POST['attachment']['sizes']['thumbnail']['url'] . ')">
					<p>' . sprintf( __( 'Please tag your new image on the <a href="%s">Witlee Store</a>', 'witlee-for-wp' ), $this->get_store_url() ) . '</p>
				</div>
			</label>';

		wp_send_json( $results );
		die();
	}

	/**
	 * Get user's store URL for tagging images
	 *
	 * @since 1.1.0
	 *
	 * @return false|string
     */
	public function get_store_url() {

		$options = get_option( 'witlee' );

		if( isset( $options['witlee_page'] ) && 0 !== $options['witlee_page'] ) {
			$url = get_the_permalink( intval( $options['witlee_page'] ) );
		} else {
			$url = 'http://shop.witlee.com/store/' . $options['witlee_user'];
		}

		return $url;
	}

	/**
	 * AJAX function - validate token
	 *
	 * @since 1.1.0
	 */
	public function validate_token() {

		$headers = array(
			'x-session' => $_POST['session']
		);

		$body = '';

		$authentication = wp_remote_get( WITLEE_API_URL . 'profile/check_session', array(
			'headers' => $headers,
			'body' => $body,
			'sslverify' => false
		) );

		if( !is_wp_error( $authentication['headers']['x-token'] ) ) {

			$token = $authentication['headers']['x-token'];

			die($token);
		}
	}

}
