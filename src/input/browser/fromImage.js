import Canvas from 'canvas-browserify';

let Image = Canvas.Image;

export default function ( image ) {
	if ( image instanceof HTMLImageElement ) {
		// http://stackoverflow.com/a/3016076/229189
		if ( ! image.naturalWidth || ! image.naturalHeight || image.complete === false ) {
			throw new Error( "This this image hasn't finished loading: " + image.src );
		}

		let canvas = new Canvas( image.naturalWidth, image.naturalHeight );
		let ctx = canvas.getContext( '2d' );
		
		ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

		let imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );

		if ( imageData.data && imageData.data.length ) {
			if ( typeof imageData.width === 'undefined' ) {
				imageData.width = image.naturalWidth;
			}

			if ( typeof imageData.height === 'undefined' ) {
				imageData.height = image.naturalHeight;
			}
		}
		
		return imageData;
	} else {
		throw new Error( 'This object does not seem to be an image.' );
		return;
	}
}