<?php

/**
 * Modal pop-up to generate Witlee shortcode
 *
 * @link       https://wpalchemists.com
 * @since      1.0.0
 *
 * @package    Witlee_For_Wp
 * @subpackage Witlee_For_Wp/admin/partials
 */
?>

<!doctype html>
<html lang="en" class="witlee-modal">
<head>
    <meta charset="utf-8">
    <title><?php _e( 'Witlee Shortcode' , 'witlee-for-wp' ); ?></a></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php
    /**
     * We call wp_print_styles ourselves, in order to replicate the functionality of wp-admin pages.
     */
    wp_print_styles();
    ?>
</head>
<body>
<div class="navigation-bar">
    <div class="witlee_shortcode_options">
        <h3><?php _e( 'Shortcode Options', 'witlee-for-wp' ); ?></h3>
        <p>
            <label for="witlee_shortcode_style"><?php _e( 'Style', 'witlee-for-wp' ); ?></label><br />
            <input type="radio" name="witlee_shortcode_style" value="carousel" checked="checked"><?php _e( 'Carousel', 'witlee-for-wp' ); ?><br />
            <input type="radio" name="witlee_shortcode_style" value="text"><?php _e( 'Text', 'witlee-for-wp' ); ?>
        </p>
        <p>
            <label for="witlee_shortcode_number"><?php _e( 'Number of Items', 'witlee-for-wp' ); ?></label><br />
            <input type="number" min="0" name="witlee_shortcode_number" id="witlee_shortcode_number" value="7">
        </p>
        <p id="witlee-shortcode-img-size-field">
            <label for="witlee_shortcode_img_size"><?php _e( 'Carousel Image Size', 'witlee-for-wp' ); ?></label><br />
            <select name="witlee_shortcode_img_size" id="witlee_shortcode_img_size">
                <option value="auto">auto</option>
                <option value="60">60px</option>
                <option value="100">100px</option>
                <option value="150">150px</option>
                <option value="200">200px</option>
                <option value="250">250px</option>
                <option value="300">300px</option>
            </select>
        </p>
        <p id="witlee-shortcode-text-field" style="display: none;">
            <label for="witlee_shortcode_text"><?php _e( 'Text to Display', 'witlee-for-wp' ); ?></label><br />
            <input type="text" name="witlee_shortcode_text" id="witlee_shortcode_text">
        </p>
        <div class="separator"></div>
        <p>
            <a href="#" class="witlee-add-images" data-uploader_title="Upload Images to Witlee" data-uploader_button_text="Upload"><?php _e( 'Add new images', 'witlee-for-wp' ); ?></a>
        </p>
    </div>
</div>
<section class="main" role="main">
    <header>
        <h1><?php _e( 'Witlee Shortcode' , 'witlee-for-wp' ); ?></h1>
    </header>
    <article>
        <div id="witlee_shortcode_imagetile">
            <h3><?php _e( 'Select Imagetile', 'witlee-for-wp' ); ?></h3>
            <div id="witlee_shortcode_imagetile_list">
                <?php echo $this->ajax_list_imagetiles( 1 ); ?>
            </div>
            <p><a class="witlee-load-more-imagetiles" data-nextpage="4" href="#"><?php _e( 'Load more imagetiles', 'witlee-for-wp' ); ?></a></p>
        </div>
        <div id="witlee_shortcode_seed" style="display: none;">
            <h3><?php _e( 'Select Seed Item', 'witlee-for-wp' ); ?></h3>
            <div id="witlee_shortcode_seed_list"><p><?php _e( 'Select an image tile above to see related seed items', 'witlee-for-wp' ); ?></p></div>
        </div>
    </article>
    <footer>
        <div class="inner text-right">
            <button id="btn-cancel" class="button-large"><?php _e( 'Cancel' , 'witlee-for-wp' ); ?></button>
            <button id="btn-ok" class="button-primary button-large" onclick="InsertShortcode();"><?php _e( 'Insert Shortcode' , 'witlee-for-wp' ); ?></button>
        </div>
    </footer>
</section>
<?php
/**
 * We call wp_print_scripts ourselves, in order to replicate the functionality of wp-admin pages.
 * However, this may need to be expanded to allow for scripts to appear in the head (such as modernizr or shim).
 */
wp_print_scripts();
wp_print_styles();
wp_footer();
?>
</body>
</html>