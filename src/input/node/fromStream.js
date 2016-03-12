import stream from 'stream';
// https://github.com/Automattic/node-canvas#imagesrcbuffer
import Canvas from 'canvas-browserify';

let Readable = stream.Readable
let Image = Canvas.Image;

export default function ( stream, resolve, reject ) {
	if ( stream instanceof Readable ) {
		let bufferContent = [ ];
				
		stream.on( 'data', function( chunk ) {
			bufferContent.push( chunk );
		} );
		
		stream.on( 'end', function() {
			try {
				let buffer = Buffer.concat( bufferContent );
				let image = new Image;
				image.src = buffer;

				let canvas = new Canvas( image.width, image.height );
				let ctx = canvas.getContext( '2d' );

				ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

				resolve( ctx.getImageData( 0, 0, canvas.width, canvas.height ) );
			} catch ( err ) {
				reject( err );
			}
		} );

	} else {
		reject( new Error( "Can't work with the buffer object provided." ) );
	}
};