var primus = Primus.connect('http://node.crowdlighting.com:8080/'),
    colors = Array('#077bf4', '#fedf01', '#c43fcd', '#0099ff', '#000000', '#cccccc', '#ff0000'), //List the hex codes you want to loop through here.
	color_index = 0,
	interval = 2500, //How long the color blend transition lasts. (in milliseconds, 1000 = 1 second)
	pulseInterval = null,
	current = 0,
    app = {
		colour: function( colour ) {
			if( colour ) {
				data = {};
				data.colour = ( colour ? colour : '#f4f4f4' );
				data.method = ('colour');
				primus.write(data);
			}
		},
		pulse: function( colour1, colour2, miliseconds ) {
			if( colour1 && colour2 && miliseconds ) {
				clearInterval( pulseInterval );
				pulseInterval = setInterval( function() {
					data = {};
					if( current == colour1 ) {
						data.colour = ( colour2 ? colour2 : '#ffffff' );
						current = colour2;
					} else {
						data.colour = ( colour1 ? colour1 : '#000000' );
						current = colour1;
					}
					data.method = ('colour');
					primus.write(data);
				}, miliseconds );
			} else {
				alert( 'Missing a field for pulse, pulse not executed' );
			}
		}
	};

$( function() {
	$( '#colour' ).bind( 'blur', function() {
		app.colour( $( this ).val() );
	}).bind( 'keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if( code == 13 ) { //Enter keycode
			app.colour( $( this ).val() );
		}
	});
	$( '#coloursubmit' ).bind( 'click', function() {
		app.colour( $( '#colour' ).val() );
	});


	$( '#colour1' ).bind( 'keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if( code == 13 ) { //Enter keycode
			app.pulse( $( '#colour1' ).val(), $( '#colour2' ).val(), ( $( '#miliseconds' ).val() ? $( '#miliseconds' ).val() : 1000 ) );
		}
	});
	$( '#colour2' ).bind( 'keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if( code == 13 ) { //Enter keycode
			app.pulse( $( '#colour1' ).val(), $( '#colour2' ).val(), ( $( '#miliseconds' ).val() ? $( '#miliseconds' ).val() : 1000 ) );
		}
	});
	$( '#miliseconds' ).bind( 'keypress', function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if( code == 13 ) { //Enter keycode
			app.pulse( $( '#colour1' ).val(), $( '#colour2' ).val(), ( $( '#miliseconds' ).val() ? $( '#miliseconds' ).val() : 1000 ) );
		}
	});

	$( '#pulsesubmit' ).bind( 'click', function() {
		app.pulse( $( '#colour1' ).val(), $( '#colour2' ).val(), ( $( '#miliseconds' ).val() ? $( '#miliseconds' ).val() : 1000 ) );
	});
	$( '#pulsestop' ).bind( 'click', function() {
		clearInterval( pulseInterval );
	});

	primus.on( 'colour', function(data) {
		if( data ) {
			$( '#colour' ).val( data.colour );
		}
	} );
});