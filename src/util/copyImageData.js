import Canvas from 'canvas-browserify';
import isImageData from '../util/isImageData';

export default function ( imageData ) {
	if ( isImageData ( imageData ) ) {
		if ( typeof Uint8ClampedArray === 'undefined' ) {
			if ( typeof window === 'undefined' ) {
				throw new Error( "Can't copy imageData in webworker without Uint8ClampedArray support." );
				return imageData;
			} else {
				
				return copyImageDataWithCanvas( imageData );
			}
		} else {
			let clampedArray = new Uint8ClampedArray( imageData.data );

			if ( typeof ImageData === 'undefined' ) {
				// http://stackoverflow.com/a/15238036/229189
				return {
					width: imageData.width,
					height: imageData.height,
					data: clampedArray
				};
			} else {
				// http://stackoverflow.com/a/15908922/229189#comment57192591_15908922
				let result;

				try {
					result = new ImageData( clampedArray, imageData.width, imageData.height );
				} catch ( err ) {
					if ( typeof window === 'undefined' ) {
						throw new Error( "Can't copy imageData in webworker without proper ImageData() support." );
						result = imageData;
					} else {
						result = copyImageDataWithCanvas( imageData );
					}
				}

				return result;
			}
		}
	} else {
		throw new Error( 'Given imageData object is not useable.' );
		return;
	}
}

// http://stackoverflow.com/a/11918126/229189
function copyImageDataWithCanvas ( imageData ) {
	let canvas = Canvas( imageData.width, imageData.height );
	let ctx = canvas.getContext( '2d' );
	ctx.putImageData( imageData, 0, 0 );
				
	return ctx.getImageData( 0, 0, imageData.width, imageData.height );
}