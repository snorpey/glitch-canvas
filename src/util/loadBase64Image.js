import { Image } from './canvas.js';
// import Canvas from './canvas.js';

// const Image = Canvas.Image;

export default function ( base64URL ) {
	return new Promise( ( resolve, reject ) => {
		const image = new Image();
		
		image.onload = () => {
			resolve( image );
		};

		image.onerror = err => {
			reject( err );
		};
		
		image.src = base64URL;
	} );
}