// https://github.com/Automattic/node-canvas#imagesrcbuffer
import Canvas from 'canvas-browserify';

let Image = Canvas.Image;

export default function ( buffer ) {
	if ( buffer instanceof Buffer ) {
		let image = new Image;
		image.src = buffer;

		let canvas = new Canvas( image.width, image.height );
		let ctx = canvas.getContext( '2d' );

		ctx.drawImage( image, 0, 0, image.width, image.height );

		return ctx.getImageData( 0, 0, canvas.width, canvas.height );
	} else {
		throw new Error( "Can't work with the buffer object provided." );
		return;
	}
};