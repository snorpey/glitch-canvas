import Canvas from 'canvas-browserify';
import isImageData from '../../util/isImageData';

export default function ( imageData, quality ) {
	return new Promise ( function ( resolve, reject ) {
		if ( isImageData( imageData ) ) {
			let canvas = new Canvas( imageData.width, imageData.height );
			let ctx = canvas.getContext( '2d' );
			ctx.putImageData( imageData, 0, 0 );

			let base64URL = canvas.toDataURL( 'image/jpeg', quality / 100 );
			resolve( base64URL );
		} else {
			reject( new Error( 'object is not valid imageData' ) );
		}
	} );
}