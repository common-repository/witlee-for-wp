<?php

/**
 * The Witlee shortcode
 *.
 *
 * @link       https://wpalchemists.com
 * @since      1.0.0
 *
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/includes
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
} ?>

<?php if( '' !== $seed ) {
    $seed_data = 'data-seed="' . $seed . '"';
} else {
    $seed_data = '';
} ?>

<span class="witlee-hover-wrapper">

    <a href="#"
        class="witlee-text-link"
        data-image="<?php echo $image; ?>"
        <?php echo $seed_data; ?>
        data-number="<?php echo $number; ?>">
        <?php echo $text; ?>
    </a>

    <span class="witlee-hidden">

        <a class="witlee-view-all" href="<?php echo $view_all; ?>" target="_blank">
            <?php _e( 'View All', 'witlee-for-wp' ); ?>&nbsp;&raquo;
        </a>

        <span class="witlee-popup-display">

        </span>

        <?php echo $this->powered_by_witlee(); ?>

    </span>

</span>


