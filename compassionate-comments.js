jQuery( document ).ready( function( $ ) {
	'use strict';

	var app = window.CompassionateComments = {

		/**
		 * Main entry point
		 */
		init: function() {
			try {
				app.registerEventHandlers();
			} catch ( exception ) {
				app.log( exception );
			}
		},

		/**
		 * Registers event handlers
		 */
		registerEventHandlers : function() {
			/*
			 * Test the comment *after* they've finished writing it. I'm assuming that they'll be more open to
			 * editing it at this point, because they'll have already gotten their strong emotions off their
			 * chest.
			 */
			$( '#commentform' ).submit( app.testComment );

			$( '#cc-actions' ).children( "button[name='cc_send_anyway']"  ).click( app.submitComment );
			$( '#cc-actions' ).children( "button[name='cc_edit_comment']" ).click( app.closeModal    );
		},

		/**
		 * Test a comment for meanness
		 *
		 * @param {object} event
		 */
		testComment : function( event ) {
			try {
				var blacklist     = [ 'stupid', 'retard' ],
					commentText   = $( '#comment' ).val(),
					isMeanComment = false;

				for ( var i = 0; i < blacklist.length; i++ ) {
					if ( -1 !== commentText.toLowerCase().indexOf( blacklist[ i ].toLowerCase() ) ) {
						isMeanComment = true;
						break;
					}
				}

				if ( ! isMeanComment ) {
					return;
				}

				event.preventDefault();
				$( '#cc-overlay' ).removeClass( 'cc-hidden' );
				$( '#cc-nudge'   ).removeClass( 'cc-hidden' );
			} catch ( exception ) {
				app.log( exception );
			}
		},

		/**
		 * Submit a comment despite the compassion nudge
		 *
		 * @param {object} event
		 */
		submitComment : function( event ) {
			try {
				/*
				 * We can't just call form.submit(), because Core names the input button #submit, which overrides
				 * the handler.
				 */
				document.createElement( 'form' ).submit.call( document.getElementById( 'commentform' ) );
			} catch( exception ) {
				app.log( exception );
			}
		},

		/**
		 * Close the modal dialog
		 *
		 * @param {object} event
		 */
		closeModal : function( event ) {
			try {
				$( '#cc-overlay' ).addClass( 'cc-hidden' );
				$( '#cc-nudge'   ).addClass( 'cc-hidden' );
			} catch( exception ) {
				app.log( exception );
			}
		},

		/**
		 * Log a message to the console
		 *
		 * @param {*} error
		 */
		log : function( error ) {
			if ( ! window.console ) {
				return;
			}

			if ( 'string' === typeof error ) {
				console.log( 'Compassionate Comments: ' + error );
			} else {
				console.log( 'Compassionate Comments: ', error );
			}
		}
	};

	app.init();
} );
