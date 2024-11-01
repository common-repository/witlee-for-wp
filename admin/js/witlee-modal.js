/**
 *  Modal / Workflow specific code
 *  This is where you'll build your workflow javascript. Remember to rename the "aut0poietic_iframe_modal_close_handler".
 */
jQuery( function($){
    "use strict";

    jQuery(document).ready(function ($) {
        var main_height = $('.main').height();
        var height = main_height - 160;
        $('article').css( 'height', height );
    } );

    jQuery(document).ready(function ($) {
        var token = localStorage.getItem( 'token' );

        if( null == token ) {
            var signin = "<a class='witlee-sign-in' href='" + witleeadminajax.settings_url + "' target='_parent'>Sign in with Instagram on your settings page to upload images to Witlee</a>";
            $('.witlee-add-images').replaceWith( signin );
        }

    } );


    // Tells any anchor with only a hash url to do nothing.
    $("a[href='#']" ).on('click', function( e ){ e.preventDefault(); });
    // Tells both the OK and Cancel buttons to close the modal.
    $('#btn-ok, #btn-cancel' ).on( 'click' , parent.witlee_iframe_modal_close_handler );


    $('.witlee-load-more-imagetiles').on('click', function (e) {

        var url = witleeadminajax.ajaxurl;
        var page = $(".witlee-load-more-imagetiles").data("nextpage");

        var data = {
            'action': 'list_imagetiles',
            'page': page
        };

        $.post(url, data, function (response) {
            $("#witlee_shortcode_imagetile_list").append(response);
            var pagenumber = parseInt( page );
            var nextpage = ++pagenumber;
            $('.witlee-load-more-imagetiles').data( 'nextpage', nextpage );
        });

    });


    $('input:radio[name="witlee_shortcode_style"]').change(
        function(){
            if ($(this).is(':checked') && $(this).val() == 'text') {
                $('#witlee-shortcode-text-field').show();
                $('#witlee_shortcode_seed').show();
                $('#witlee-shortcode-img-size-field').hide();
            }
            if ($(this).is(':checked') && $(this).val() == 'carousel') {
                $('#witlee-shortcode-text-field').hide();
                $('#witlee_shortcode_seed').hide();
                $('#witlee-shortcode-img-size-field').show();
            }
        });

    $('body').on( 'change', 'input:radio[name="witlee_shortcode_imagetile"]', function(e){

        var url = witleeadminajax.ajaxurl;
        var imagetile = $(this).val();
        var data = {
            'action': 'list_seed_items',
            'imagetile': imagetile
        };

        $.post(url, data, function (response) {
            $("#witlee_shortcode_seed_list").html(response);
        });

    });

    // Uploading files
    var file_frame;

    jQuery('.witlee-add-images').live('click', function( event ){

        event.preventDefault();

        // If the media frame already exists, reopen it.
        if ( file_frame ) {
            file_frame.open();
            return;
        }

        // Create the media frame.
        file_frame = wp.media.frames.file_frame = wp.media({
            title: jQuery( this ).data( 'uploader_title' ),
            button: {
                text: jQuery( this ).data( 'uploader_button_text' ),
            },
            multiple: true  // Set to true to allow multiple files to be selected
        });

        var url = witleeadminajax.ajaxurl;
        file_frame.on( 'select', function() {

            var selection = file_frame.state().get('selection');
            var token = localStorage.getItem( 'token' );
            var session = localStorage.getItem( 'xsession' );

            selection.map( function( attachment ) {

                attachment = attachment.toJSON();

                var data = {
                    'action': 'upload_imagetile',
                    'attachment': attachment,
                    'token': token,
                    'session': session
                };

                $.post(url, data, function (response) {
                    $("#witlee_shortcode_imagetile_list").prepend( response.html );
                    $(".error-message").hide();
                    if( 'error' == response.status ) {
                        localStorage.removeItem( 'token' );
                    }
                });

            });
        });

        // Finally, open the modal
        file_frame.open();
    });

});

function InsertShortcode() {

    var option_display = jQuery("input[name=witlee_shortcode_style]:checked").val();
    var attr_display = !option_display ? "" : " display=\"" + option_display + "\"";

    var option_image = jQuery('input[name=witlee_shortcode_imagetile]:checked').val();
    var attr_image = !option_image ? "" : " image=\"" + option_image + "\"";

    var option_number = jQuery("#witlee_shortcode_number").val();
    var attr_number = !option_number ? "" : " number=\"" + option_number + "\"";

    var option_seed = jQuery("input[name=witlee_shortcode_seed]:checked").val();
    var attr_seed = !option_seed ? "" : " seed=\"" + option_seed + "\"";

    var option_img_size = jQuery("#witlee_shortcode_img_size").val();
    var attr_img_size = !option_img_size ? "" : " img_size=\"" + option_img_size + "\"";

    var option_text = jQuery("#witlee_shortcode_text").val();
    var attr_text = !option_text ? "" : " text=\"" + option_text + "\"";

    if( "" == attr_image ) {
        window.alert("You must select an image!");
        return;
    }

    if( 'text' == option_display && "" == attr_text ) {
        window.alert("You must enter some text to display!");
        return;
    }

    if( 'text' == option_display && "" == attr_seed ) {
        window.alert("You must select a seed item!");
        return;
    }

    top.send_to_editor( "[witlee" + attr_display + attr_image + attr_number + attr_seed + attr_img_size + attr_text + "]" );
}