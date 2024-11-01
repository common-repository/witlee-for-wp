(function( $ ) {
	'use strict';

	 $( window ).load(function() {

		 var loaded = false;

		 $( '.witlee-text-link' ).hover(
			 function(e) {

				 var div = $(e.target).next();

				 if ( !$( div ).hasClass( 'witlee-loaded' ) ) {

					 var url = witleeajax.ajaxurl;
					 var number = $(e.target).attr('data-number');
					 var image = $(e.target).attr('data-image');
					 var seed = $(e.target).attr('data-seed');
					 var xsession = get_session();

					 var data = {
						 'action': 'ajax_get_items',
						 'number': number,
						 'image': image,
						 'seed': seed,
						 'session': xsession
					 };

					 $.post(url, data, function (response) {
						 $(div).find('.witlee-popup-display').html(response);
						 $(div).addClass('witlee-loaded');
					 });


				 }
				 }, function( e ) {

		 }).on( 'click', function (e) {
			 e.preventDefault();
		 });

		 $( '.witlee-carousel-link' ).on( 'mouseover', function (e) {


				 var seed = $(e.currentTarget).attr('data-seed');

				 var div = $('.witlee-hidden').filter('[data-seed="' + seed + '"]');
				 $(div).show();

				 if ( !$( div ).hasClass( 'witlee-loaded' ) ) {

					 var url = witleeajax.ajaxurl;
					 var number = $(e.currentTarget).attr('data-number');
					 var image = $(e.currentTarget).attr('data-image');
					 var xsession = get_session();
					 var data = {
						 'action': 'ajax_get_items',
						 'number': number,
						 'image': image,
						 'seed': seed,
						 'session': xsession
					 };

					 $.post(url, data, function (response) {
						 $(div).find('.witlee-popup-display').html(response);
						 $(div).addClass('witlee-loaded');
					 });


				 }
			 } ).on( 'mouseout', function (e) {
				 var seed = $(e.currentTarget).attr('data-seed');

				 var div = $('.witlee-hidden').filter('[data-seed="' + seed + '"]');
				 $(div).hide();

			 }).on( 'click', function (e) {
			 e.preventDefault();
		 });

		 $( '.carousel-popup').on( 'mouseover', function (e) {
			 $(this).show();
		 }).on( 'mouseout', function (e) {
			 $(this).hide();
		 });

		 function get_session() {
			 if( !localStorage.getItem( 'xsession' ) ) {
				 var url = witleeajax.ajaxurl;
				 var data = {
					 'action': 'ajax_get_session'
				 };

				 $.post(url, data, function (response) {
					 localStorage.setItem('xsession', response);
					 var xsession = response;
				 });
			 } else {
				 var xsession = localStorage.getItem( 'xsession' );
			 }

			 return xsession;
		 }

	 });

})( jQuery );
