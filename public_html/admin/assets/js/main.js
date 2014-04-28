var primus = Primus.connect('http://node.crowdlighting.com:8080/'),
    colors = Array('#077bf4', '#fedf01', '#c43fcd', '#0099ff', '#000000', '#cccccc', '#ff0000'), //List the hex codes you want to loop through here.
	color_index = 0,
	interval = 2500, //How long the color blend transition lasts. (in milliseconds, 1000 = 1 second)
	pulseInterval = {},
	current = 0,
    app = {
		colour: function( colour, id ) {
			if( colour ) {
				data = {};
				data.colour = ( colour ? colour : '#f4f4f4' );
				data.id     = id;
				data.method = ('colour');
				primus.write(data);
			}
		},
		pulse: function( colour1, colour2, miliseconds, id ) {
			if( colour1 && colour2 && miliseconds ) {
				clearInterval( pulseInterval.id );
				pulseInterval.id = setInterval( function() {
					data = {};
					if( current == colour1 ) {
						data.colour = ( colour2 ? colour2 : '#ffffff' );
						current = colour2;
					} else {
						data.colour = ( colour1 ? colour1 : '#000000' );
						current = colour1;
					}
					data.id     = id;
					data.method = ('colour');
					primus.write(data);
				}, miliseconds );
			} else {
				alert( 'Missing a field for pulse, pulse not executed' );
			}
		}
	};

$(".picker").spectrum({
    color: "#f4f4f4",
    flat: true,
    change: function(color) {
        app.colour('#' + color.toHex(), $(this).attr('id').replace('colour', ''));
        this.value = '#' + color.toHex();
    },
    move: function (color) {
        app.colour('#' + color.toHex(), $(this).attr('id').replace('colour', ''));
        this.value = '#' + color.toHex();
    }
});

primus.on( 'colour', function(data) {
	console.log(data);
	if( data ) {
		$( '#colour' + data.id ).spectrum("set", data.colour);
		$( '#pulse' + data.id + '-1' ).spectrum("set", data.colour);
	}
});

$( function() {
	for(var i = 1 ; i < 11 ; i++) {
		$( '#colour' + i ).bind( 'blur', function() {
			app.colour( $( this ).val(), i );
		}).bind( 'keypress', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if( code == 13 ) { //Enter keycode
				app.colour( $( this ).val(), i );
			}
		});

		$( '#pulse'+i+'-1' ).bind( 'keypress', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if( code == 13 ) { //Enter keycode
				app.pulse( $( '#pulse'+i+'-1' ).val(), $( '#pulse'+i+'-2' ).val(), ( $( '#pulse'+i+'-3' ).val() ? $( '#pulse'+i+'-3' ).val() : 1000 ), i );
			}
		});
		$( '#pulse'+i+'-2' ).bind( 'keypress', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if( code == 13 ) { //Enter keycode
				app.pulse( $( '#pulse'+i+'-1' ).val(), $( '#pulse'+i+'-2' ).val(), ( $( '#pulse'+i+'-3' ).val() ? $( '#pulse'+i+'-3' ).val() : 1000 ), i );
			}
		});
		$( '#pulse'+i+'-3' ).bind( 'keypress', function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if( code == 13 ) { //Enter keycode
				app.pulse( $( '#pulse'+i+'-1' ).val(), $( '#pulse'+i+'-2' ).val(), ( $( '#pulse'+i+'-3' ).val() ? $( '#pulse'+i+'-3' ).val() : 1000 ), i );
			}
		});
		$( '#pulsesubmit'+i ).bind( 'click', function() {
			var id = $(this).attr('id').replace('pulsesubmit', '');
			app.pulse( $( '#pulse'+id+'-1' ).val(), $( '#pulse'+id+'-2' ).val(), ( $( '#pulse'+id+'-3' ).val() ? $( '#pulse'+id+'-3' ).val() : 1000 ), id );
		});
		$( '#pulsestop'+i ).bind( 'click', function() {
			var id = $(this).attr('id').replace('pulsestop', '');
			clearInterval( pulseInterval.id );
		});
	}
});