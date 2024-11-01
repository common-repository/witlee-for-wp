<?php
/**
 * The options class.
 *
 * Creates the Witlee options page and saves the data
 *
 * @since      1.2.2
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/includes
 * @author     Morgan Kay <morgan@wpalchemists.com>
 */

class Witlee {
    private $witlee_options;

    public function __construct() {
        /* add_action( 'admin_menu', array( $this, 'witlee_add_plugin_page' ) ); */
        add_action( 'admin_init', array( $this, 'witlee_page_init' ) );
    }

    public function witlee_add_plugin_page() {
        add_options_page(
            'Witlee', // page_title
            'Witlee', // menu_title
            'manage_options', // capability
            'witlee', // menu_slug
            array( $this, 'witlee_create_admin_page' ) // function
        );
    }

    public function witlee_create_admin_page() {
        $this->witlee_options = get_option( 'witlee' ); ?>

        <div class="wrap">
            <h2><?php _e( 'Witlee', 'witlee-for-wp' ); ?></h2>
            <?php //settings_errors(); ?>

            <form method="post" action="options.php">
                <?php
                settings_fields( 'witlee_option_group' );
                do_settings_sections( 'witlee-admin' );
                // submit_button();
                ?>
            </form>

        </div>
    <?php }

    public function witlee_page_init() {

        add_settings_field(
            'witlee_user', // id
            __( 'Instagram Username', 'witlee-for-wp' ), // title
            array( $this, 'witlee_user_callback' ), // callback
            'witlee-admin', // page
            'witlee_setting_section' // section
        );
    }

    public function witlee_sanitize( $input ) {
        $sanitary_values = array();

        if( isset( $input['witlee_user'] ) ) {
            $sanitary_values['witlee_user'] = sanitize_text_field( $input['witlee_user'] );
        }

        if( isset( $input['witlee_page'] ) ) {
            $sanitary_values['witlee_page'] = intval( $input['witlee_page'] );
        }

        if( isset( $input['witlee_theme'] ) ) {
            $sanitary_values['witlee_theme'] = sanitize_text_field( $input['witlee_theme'] );
        }

        if( isset( $input['witlee_sticky'] ) ) {
            $sanitary_values['witlee_sticky'] = sanitize_text_field( $input['witlee_sticky'] );
        }

        return $sanitary_values;
    }

    public function witlee_section_info() {

    }

    public function witlee_tracking_callback(  ) {
        ?><span class="description"><?php _e( 'If you do not turn on this setting, you are missing out on income!', 'witlee-for-wp' ); ?></span><br />
        <input type='checkbox' name='witlee[witlee_tracking]' <?php checked( $this->witlee_options['witlee_tracking'], 1 ); ?> value='1' id="witlee-tracking">
        <label for="witlee-tracking"><?php _e( 'Allow Witlee to track the traffic on your site so that you can earn referral income', 'witlee-for-wp' ); ?></label>
        <?php
    }

    public function witlee_link_callback(  ) {
        ?>
        <input type='checkbox' name='witlee[witlee_link]' <?php checked( $this->witlee_options['witlee_link'], 1 ); ?> value='1' id="witlee-link">
        <label for="witlee-link"><?php _e( 'Link to Witlee.com', 'witlee-for-wp' ); ?></label>
        <?php
    }

    public function witlee_user_callback() {
        printf(
            '<input class="regular-text" type="text" name="witlee[witlee_user]" id="witlee_user" value="%s">',
            isset( $this->witlee_options['witlee_user'] ) ? esc_attr( $this->witlee_options['witlee_user']) : ''
        );
        if( $this->witlee_options['witlee_user'] ) {
            $disabled = '';
        } else {
            $disabled = 'disabled';
        }?>
        <span id="witlee-instagram-login"></span>
    <?php }

    public function witlee_page_callback() {
        ?> <span class="description"><?php _e( 'Choose the page where you want to display your Witlee store', 'witlee-for-wp' ); ?></span><br />
        <select name="witlee[witlee_page]" id="witlee_page">
            <option value=""></option>
            <?php $pages = get_pages( 'post_type=page&posts_per_page=-1&orderby=name&order=ASC');
            foreach( $pages as $page ) { ?>
                <option value="<?php echo $page->ID; ?>" <?php selected( $page->ID, $this->witlee_options['witlee_page'] ); ?>>
                    <?php echo $page->post_title; ?>
                </option>
            <?php } ?>
        </select> <?php
    }

    public function witlee_theme_callback() {
        ?> <select name="witlee[witlee_theme]" id="witlee_theme">
            <option value="" <?php selected( '', $this->witlee_options['witlee_theme'] ); ?>><?php _e( 'Standard Theme', 'witlee-for-wp' ); ?></option>
            <option value="light" <?php selected( 'light', $this->witlee_options['witlee_theme'] ); ?>><?php _e( 'Light Background', 'witlee-for-wp' ); ?></option>
            <option value="dark" <?php selected( 'dark', $this->witlee_options['witlee_theme'] ); ?>><?php _e( 'Dark Background', 'witlee-for-wp' ); ?></option>
        </select> <?php
    }

    public function witlee_sticky_callback() {
        printf(
            '<span class="description">' . __( 'If your theme has a sticky header, enter the ID or class of the sticky header so that it will not interfere with the Witlee store sticky header', 'witlee-for-wp' ) . '</span><br />
            <input class="regular-text" type="text" name="witlee[witlee_sticky]" id="witlee_sticky" value="%s">',
            isset( $this->witlee_options['witlee_sticky'] ) ? esc_attr( $this->witlee_options['witlee_sticky']) : ''
        );
    }

}
if ( is_admin() )
    $witlee = new Witlee();

