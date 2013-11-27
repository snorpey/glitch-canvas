/*global require, requirejs */
// this script uses requirejs for dependency management.
// see http://requirejs.org/docs/api.html#config for more information
requirejs.config(
	{
		baseUrl: 'scripts/',
		waitSeconds: 50,
		urlArgs: 'bust=' + ( new Date() ).getTime()
	}
);

require(
	[
		'../../src/glitch',
	],
	function( glitch )
	{
		// getting both canvases + drawing contexts
		var canvas_one = document.getElementById( 'canvas-one' );
		var canvas_two = document.getElementById( 'canvas-two' );

		var ctx_1 = canvas_one.getContext( '2d' );
		var ctx_2 = canvas_two.getContext( '2d' );

		// storing canvas dimensions
		var canvas_width = canvas_one.clientWidth;
		var canvas_height = canvas_one.clientHeight;

		// draw a white background (transparent pixels are converted to black after glitching)
		ctx_1.fillStyle = '#ffffff';
		ctx_1.fillRect( 0, 0, canvas_width, canvas_height );

		// draw some random stuff on canvas one so we have something to glitch
		for ( var i = 0; i < 30; i++ )
		{
			ctx_1.beginPath();
			ctx_1.moveTo( Math.random() * canvas_width, Math.random() * canvas_height );
			ctx_1.lineTo( Math.random() * canvas_width, Math.random() * canvas_height );
			ctx_1.lineTo( Math.random() * canvas_width, Math.random() * canvas_height );
			ctx_1.closePath();
			ctx_1.fillStyle = getRandomColor();
			ctx_1.fill();
		}

		// getting the image data from canvas one
		// https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D#getImageData()
		var image_data_1 = ctx_1.getImageData( 0, 0, canvas_width, canvas_height );

		// glitch the image data (passing drawImageDataInCanvasTwo as a callback function)
		var glitch_options = { amount: 10, seed: 45, iterations: 30, quality: 30 };
		
		glitch( image_data_1, glitch_options, drawImageDataInCanvasTwo );
		
		function drawImageDataInCanvasTwo( image_data )
		{
			// put the glitched image data on canvas two.
			// https://developer.mozilla.org/en/docs/Web/API/CanvasRenderingContext2D#putImageData()
			ctx_2.putImageData( image_data, 0, 0 );
		}

		// http://stackoverflow.com/a/1484514/229189
		function getRandomColor()
		{
			var letters = '0123456789ABCDEF'.split( '' );
			var color = '#';
			
			for ( var i = 0; i < 6; i++ )
			{
				color += letters[ Math.round(Math.random() * 15) ];
			}

			return color;
		}
	}
);