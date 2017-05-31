import Canvas from './canvas.js';

const Image = Canvas.Image;

export default function ( base64URL ) {
	return new Promise( function ( resolve, reject ) {
		let image = new Image();
		
		image.onload = function () {
			resolve( image );
		};

		image.onerror = function ( err ) {
			reject( err );
		};
		
		image.src = base64URL;
	} );
}