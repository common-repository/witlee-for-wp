(function( $ ) {
	'use strict';

	jQuery(document).ready(function ($) {

		/**
		 * Attaches the event handler for #open-iframe_modal.click
		 */
		$( '#witlee-iframe_modal' ).on( "click" , function ( e ) {

			e.preventDefault();

			// Retrieve the URL for th iframe stored in data-content-url created in Plugin::metabox_content
			var url = $( e.currentTarget ).attr( "data-content-url" ) ,
				$dialogHTML = $('<div tabindex="0" id="iframe_modal_dialog" role="dialog"><div class="iframe_modal" ><a role="button" class="iframe_modal-close" href="#" title="Close"><span class="iframe_modal-icon ir">Close</span></a><div class="iframe_modal-content"><iframe id="iframe_modal-frame" src="" scrolling="no" frameborder="0" allowtransparency="true"></iframe></div></div><div class="iframe_modal-backdrop" role="presentation"></div></div>' );

			if( typeof window.aut0poietic_iframe_modal_l10n === 'object' ) {
				$dialogHTML.find( '.iframe_modal-close' ).attr( 'title' , aut0poietic_iframe_modal_l10n.close_label ) ;
				$dialogHTML.find( '.iframe_modal-icon' ).text( aut0poietic_iframe_modal_l10n.close_label ) ;
			}
			// Sets the URL of the iframe
			$dialogHTML.find('#iframe_modal-frame' ).attr('src' , url );

			// Attach the close button event handler.
			$dialogHTML.find( '.iframe_modal-close' ).on( "click" , window.witlee_iframe_modal_close_handler ) ;

			// When the user shifts focus (typically through pressing the tab key ).
			// If the new focus target is not a child of the modal or the modal itself,
			// set the focus on the modal -- thus resetting the tab order.
			$( document ).on( "focusin" , function( e ) {
				var $element = jQuery( '#iframe_modal_dialog' );
				if ( $element[0] !== e.target && !$element.has( e.target ).length ) {
					$element.focus();
				}
			} ) ;
			// Set overflow to hidden on the body, preventing the user from scrolling the
			// disabled content and append the dialog to the body.
			$( "body" ).css( { "overflow": "hidden" } ).append( $dialogHTML );
		} );

		/**
		 *  Global Modal.close method.
		 *  Unfortunately, we must expose the method globally so that the iframe can access the method, removing
		 *  event-handlers added during Modal.open
		 * @param e jQuery-Normalized event object
		 */
		window.witlee_iframe_modal_close_handler = function( e ){
			e.preventDefault();
			$( document ).off( "focusin" ) ;
			$( "body" ).css( { "overflow": "auto" } );
			$( ".iframe_modal-close" ).off( "click" );
			$( "#iframe_modal_dialog").remove( ) ;
		};

		$( '.witlee-notice' ).on( 'click', '.notice-dismiss', function( event ) {

			var url = witleeadminajax.ajaxurl;
			var data = {
				'action': 'notice_dismissed',
			};

			$.post(url, data, function (response) {

			});
		});

		var token = localStorage.getItem( 'token' );
		var xsession = localStorage.getItem( 'xsession' );

		if( null == token || '' == token ) {

			var return_url = (window.location != window.parent.location)
				? document.referrer
				: document.location;
			var signin = "<br /><a class='witlee-sign-in button-primary' href='" + witleeadminajax.api_url + "profile/login/instagram?xs=" + xsession + "&dest=" + witleeadminajax.return_url + "'>Sign in with Instagram</a>";
			$('#witlee-instagram-login').replaceWith( signin );
		}

	});

	var session = getParameterByName('session');

	if( null !== session ) {
		localStorage.setItem( 'xsession', session );

		var url = witleeadminajax.ajaxurl;
		var data = {
			'action': 'validate_token',
			'session': session,
		};

		$.post(url, data, function (response) {
			localStorage.setItem( 'token', response );
			$('.witlee-sign-in').hide();
		});

	}

	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}


})( jQuery );


