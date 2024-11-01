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


<div class="witlee-carousel-wrapper">

    <ul class="witlee-carousel">

        <?php
        foreach( $links as $link ) { ?>

            <li class="witlee-hover-wrapper" <?php echo $size; ?>>
                <a href="#"
                   class="witlee-carousel-link"
                   data-image="<?php echo $image; ?>"
                   data-seed="<?php echo $link['seed']; ?>"
                   data-number="<?php echo $number; ?>">
                    <div class="witlee-image" style="background-image: url('<?php echo $link['img']; ?>');"></div>
                </a>

            </li>

        <?php } ?>

    </ul>

    <?php
    foreach( $links as $link ) { ?>

        <div class="witlee-hidden carousel-popup" data-seed="<?php echo $link['seed']; ?>">

            <a class="witlee-view-all" href="<?php echo $view_all; ?>" target="_blank">
                <?php _e( 'View All', 'witlee-for-wp' ); ?>&nbsp;&raquo;
            </a>

            <ul class="witlee-popup-display">

            </ul>

            <?php echo $this->powered_by_witlee(); ?>

        </div>


    <?php } ?>

</div>

