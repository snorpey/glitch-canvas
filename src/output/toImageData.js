import loadBase64Image from '../util/loadBase64Image';
import canvasFromImage from '../util/canvasFromImage';
import getImageSize from '../util/getImageSize';

export default function ( base64URL, options, resolve, reject ) {
	loadBase64Image( base64URL )
		.then( function ( image ) {
			let size = getImageSize( image );
			let imageData = canvasFromImage( image ).ctx.getImageData( 0, 0, size.width, size.height );
			
			if ( ! imageData.width ) {
				imageData.width = size.width;
			}

			if ( ! imageData.height ) {
				imageData.height = size.height;
			}

			resolve( imageData );
		}, reject );
}