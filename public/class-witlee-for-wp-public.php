<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://wpalchemists.com
 * @since      1.0.0
 *
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/public
 * @author     Morgan Kay <morgan@wpalchemists.com>
 */
class Witlee_For_Wp_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the JavaScript for the public views.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/witlee-for-wp-public.css', array(), $this->version, 'all' );
		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/witlee-for-wp-public.js', array( 'jquery' ), $this->version, false );
		wp_localize_script( $this->plugin_name, 'witleeajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
	}

	/**
	 * Witlee shortcode
	 *
	 * User must include at least the imagetile ID.
	 *
	 * @param $atts
	 * @return string|void
     */
	public function witlee_shortcode( $atts ) {

		// Attributes
		extract( shortcode_atts(
			array(
					'seed' => '', // id of seed item
					'image' => '', // id of seed image, required
					'display' => 'text', // options: text, carousel
					'text' => '', // text of text link
					'number' => '9', // number of items to display
					'img_size' => 'auto', // size of carousel image
			), $atts )
		);

		if( 'carousel' == $display ) {
			wp_enqueue_script( 'lightslider', plugin_dir_url( __FILE__ ) . 'js/lightslider.js', array( 'jquery' ), $this->version, false );
		}

//		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/witlee-for-wp-public.js', array( 'jquery' ), $this->version, false );
//		wp_localize_script( $this->plugin_name, 'witleeajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
//		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/witlee-for-wp-public.css', array(), $this->version, 'all' );

		if( '' == $image ) {
			$error = __( 'You must provide an image ID', 'witlee-for-wp' );
			return $error;
		}

		$view_all = $this->get_view_all_link( $image );

		if( 'text' == $display ) {

			if( '' == $text ) {
				$error = __( 'You must enter some text to display', 'witlee-for-wp' );
				return $error;
			}

			if( '' == $seed ) {
				$error = __( 'You must provide a seed id to use the text display', 'witlee-for-wp' );
				return $error;
			}

			ob_start();
			include 'partials/witlee-shortcode-text.php';
			return ob_get_clean();


		} elseif( 'carousel' == $display ) {

			$links = $this->get_imagetile_links( $image, $number );

			if( !is_array( $links ) ) {
				return $links;
			}

			if( 'auto' == $img_size ) {
				$size = '';
			} else {
				$size = 'style="width: ' . intval( $img_size ) . 'px; height: ' . intval( $img_size ) . 'px;"';
			}

			ob_start();
			include 'partials/witlee-shortcode-carousel.php';
			return ob_get_clean();

		}

		$error = __( 'There was an error parsing your shortcode.', 'witlee-for-wp' );
		return $error;

	}


	/**
	 * Given a seed ID and imagetile ID, return an array of the images and links to display in the shortcode
	 *
	 * @param $seed
	 * @param $image
	 * @param $number
	 * @return array|int|string|void
     */
	public function get_seed_links( $seed, $image, $number ) {

		$links = array();

		$products = wp_remote_get( WITLEE_API_URL . '/imagetiles/' . intval( $image ) . '/seeds/' . intval( $seed ) . '/products', array( 'sslverify' => false ) );
		if( is_wp_error( $products ) ) {
			$error = __( 'Unable to connect to the Witlee API', 'witlee-for-wp' );
			return $error;
		} elseif( '404' == $products['response']['code'] ) {
			$error = printf( __( 'Unable to find the image with id %s.', 'witlee-for-wp' ), $image );
			return $error;
		} else {
			$result = json_decode( $products['body'] );
			$items = $result->results;
			if( !empty( $items ) ) {
				$i = 0;
				foreach( $items as $item ) {

					$links[$i]['url'] = WITLEE_API_URL . 'clicks/' . $seed . '/products/' . $item->id;
					$links[$i]['img'] = $item->img->url;
					$links[$i]['name'] = $item->product_name;
					$links[$i]['price'] = $item->price;
					$links[$i]['brand'] = $item->brand;
					$links[$i]['retailer'] = $item->retailer_name;
					$links[$i]['instock'] = $item->instock;
					$i++;
					if( $i > $number ) {
						break;
					}
				}
			}
		}

		return $links;
	}

	/**
	 * Given an image ID, generate an array of images and links to display in the shortcode
	 *
	 * @param $image
	 * @param $number
	 * @return array|string|void
     */
	public function get_imagetile_links( $image, $number ) {

		$links = array();

		$imagetiles = wp_remote_get( WITLEE_API_URL . 'imagetiles/' . intval( $image ), array( 'sslverify' => false ) );

		if( is_wp_error( $imagetiles ) ) {
			$error = __( 'Unable to connect to the Witlee API', 'witlee-for-wp' );
			return $error;
		} elseif( '404' == $imagetiles['response']['code'] ) {
			$error = __( 'Unable to find that image ID.', 'witlee-for-wp' );
			return $error;
		} else {
			$result = json_decode( $imagetiles['body'] );
			$items = $result->seeds;

			if( !empty( $items ) ) {
				$i = 0;
				foreach( $items as $item ) {

					if( $this->get_click( $image, $item->id ) ) {
						$url = $this->get_click( $image, $item->id );
					} else {
						$url = $item->retailer_url;
					}

					$links[$i]['url'] = $this->get_click( $image, $item->id );
					$links[$i]['img'] = $this->make_square( $item->image_url );
					$links[$i]['name'] = $item->name;
					$links[$i]['price'] = $item->price;
					$links[$i]['seed'] = $item->id;
					$links[$i]['brand'] = $item->brand;
					$links[$i]['retailer'] = $item->retailer;
                    $links[$i]['instock'] = $item->instock;
					$i++;
					if( $i > $number ) {
						break;
					}
				}
			}
		}

		return $links;
	}

	/**
	 * Get the appropriate API link for the item
	 *
	 * @param $image
	 * @param $seed
	 * @return bool|string
     */
	public function get_click( $image, $seed ) {

		$products = wp_remote_get( WITLEE_API_URL . '/imagetiles/' . intval( $image ) . '/seeds/' . intval( $seed ) . '/products', array( 'sslverify' => false ) );

		if( is_wp_error( $products ) ) {
			return false;
		} elseif( '404' == $products['response']['code'] ) {
			return false;
		} else {
			$result = json_decode( $products['body'] );
			$items = $result->results;
			if( !empty( $items ) ) {
				$product_id = $items[0]->id;
				$url = WITLEE_API_URL . 'clicks/' . $seed . '/products/' . $product_id;
				return $url;
			}
		}

		return false;

	}


	/**
	 * If the link is a text link, this ajax function returns the images and links to display
	 *
     */
	public function ajax_get_list() {
		if( isset( $_POST['seed'] ) ) {
			$links = $this->get_seed_links( $_POST['seed'], $_POST['image'], $_POST['number'] );
			$this->phone_home( $_POST['session'], $_POST['image'], $_POST['seed'] );
		} else {
			$links = $this->get_imagetile_links( $_POST['image'], $_POST['number'] );
			$this->phone_home( $_POST['session'], $_POST['image'] );
		}

		$html = '';

		$i = 0;

		foreach( $links as $link ) {

			if( 0 == $i ) {
				$class = 'witlee-featured';
			} elseif( 1 == $i ) {
				$class = 'witlee-related first';
			} else {
				$class = 'witlee-related';
			}
			if($link['instock'] == 1) {
			    $sold_out = 'witlee-available';
			} else {
			    $sold_out = 'witlee-sold-out';
			}

			$html .= '<li class="' . $class . '">
				<a href="' . $link['url'] . '" target="_blank">
					<div class="witlee-image" style="background-image: url(' . $link['img'] . ');">
					  <div class="witlee-image witlee-overlay ' . $sold_out . '" style="background-image: url(https://cdn.witlee.com/images/sold_out.png)"></div>
					</div>
					<span class="witlee-item-name">' . $link['brand'] . '</span>
					<span class="witlee-item-name">' . $link['name'] . '</span>
					<span class="witlee-item-name">' . $link['retailer'] . '</span>
					<span class="witlee-item-price">$' . $link['price'] . '</span>
				</a>
			</li>';

			$i++;

		}

		die( $html );
	}

	/**
	 * Generate the "view all" link for the pop-up display
	 *
	 * @param $image
	 * @return string
     */
	public function get_view_all_link( $image ) {

		$options = get_option( 'witlee' );

		if( isset( $options['witlee_page'] ) && 0 !== $options['witlee_page'] ) {
			$url = get_the_permalink( intval( $options['witlee_page'] ) ) . '#/product/' . $image;
		} else {
			$url = 'http://shop.witlee.com/product/' . $image;
		}

		return $url;
	}

	/**
	 * Get the square version of an image
	 *
	 * @param $img_url
	 * @return string
     */
	public function make_square( $img_url ) {

		$square_image = preg_replace( "/std/", "square", $img_url );

		if( $this->validate_url( $square_image ) ) {
			$url = $square_image;
		} else {
			$url = $img_url;
		}

		return $url;
	}

	/**
	 * Check whether a URL is valid
	 *
	 * @param $url
	 * @return bool
     */
	public function validate_url( $url ) {

		$file_headers = @get_headers( $url );
		if( $file_headers[0] == 'HTTP/1.1 404 Not Found' ) {
			return false;
		} else {
			return true;
		}

	}

	/**
	 * Get the HTML for the "powered by Witlee" at the bottom of shortcode pop-ups
	 *
	 * @return string
     */
	public function powered_by_witlee() {

		$options = get_option( 'witlee' );

		$text = __( 'Powered by Witlee', 'witlee-for-wp' );

		$powered_by = '<span class="witlee-attribution">';

		if( isset( $options['witlee_link'] ) && '1' == $options['witlee_link'] ) {
			$powered_by .= '<a href="http://witlee.com" target="_blank">' . $text . '</a>';
		} else {
			$powered_by .= $text;
		}

		$powered_by .= '</span>';

		return $powered_by;

	}

	/**
	 * If tracking is turned on, send log_event to Witlee API
	 *
	 * @param $session
	 * @param $imagetile
	 * @param string $seed
     */
	public function phone_home( $session, $imagetile, $seed = 'no seed' ) {

		$options = get_option( 'witlee' );

		if( 1 !== $options['witlee_tracking'] ) {
			// tracking is off, so abort here
			return;
		}

		$headers = array(
			'X-session' => $session
		);

		$body = array(
			'event' => 'wp-product',
			'sub_event' => 'visit',
			'embedded' => true,
			'store_uuid' => $this->get_witlee_username(),
			'image_id' => $imagetile,
			'seed_id' => $seed,
		);

		wp_remote_post( WITLEE_API_URL . '/log_event/', array(
			'headers' => $headers,
			'body' => $body,
			'sslverify' => false
		) );

	}

	/**
	 * Get the site's Witlee username, as stored in settings
	 *
	 * @return bool
     */
	private function get_witlee_username() {

		$options = get_option( 'witlee' );

		if( isset( $options['witlee_user'] ) && '' !== $options['witlee_user'] ) {
			return $options['witlee_user'];
		} else {
			return false;
		}

	}

	public function include_google_analytics() {

		$options = get_option( 'witlee' );

		if( 1 !== $options['witlee_tracking'] ) {
			// tracking is off, so abort here
			return;
		}

		global $post;

		if( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'witlee' ) ) {

			echo "<!-- Witlee Google Analytics -->
			<script>
			  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
			  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
			  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
			  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

			  ga('create', 'UA-60449307-4', 'auto');
			  ga('send', 'pageview');

			</script>";
		}
	}

	public function get_session() {

		$options = get_option( 'witlee' );

		if( 1 !== $options['witlee_tracking'] ) {
			// tracking is off, so abort here
			$result = 'tracking disabled';
			die( $result );
		}

		$session = wp_remote_get( WITLEE_API_URL . '/profile/new_session', array( 'sslverify' => false ) );

		if( is_wp_error( $session ) ) {
			$error = 'error retrieving new session';
			die( $error );
		} else {
			$result = json_decode( $session['body'] );
			$xsession = $result->session;
			die( $xsession );
		}
	}

}
