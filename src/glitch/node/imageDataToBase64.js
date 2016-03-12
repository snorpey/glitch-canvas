import Canvas from 'canvas-browserify';
import isImageData from '../../util/isImageData';

export default function ( imageData, quality ) {
	return new Promise ( function ( resolve, reject ) {
		if ( isImageData( imageData ) ) {
			let canvas = new Canvas( imageData.width, imageData.height );
			let ctx = canvas.getContext( '2d' );
			ctx.putImageData( imageData, 0, 0 );

			canvas.toDataURL( 'image/jpeg', quality / 100, function ( err, base64URL ) {
					if ( err ) { reject( err ); }
					
					switch ( base64URL.length % 4 ) {
						case 3:
							base64URL += '=';
							break;
						case 2:
							base64URL += '==';
							break;
						case 1:
							base64URL += '===';
							break;
					}
					
					resolve( base64URL );
				} );
		} else {
			reject( new Error( 'object is not valid imageData' ) );
		}
	} );
}