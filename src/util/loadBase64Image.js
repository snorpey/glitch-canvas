import { Image } from 'canvas-browserify';

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