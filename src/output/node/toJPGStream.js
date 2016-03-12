// https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream
import loadBase64Image from '../../util/loadBase64Image';
import canvasFromImage from '../../util/canvasFromImage';

export default function ( base64URL, options, resolve, reject ) {
	options = options || { };

	let streamParams = {
		bufsize: options.bufsize || 4096,
		quality: options.quality || 75,
		progressive: options.progressive || false
	};

	loadBase64Image( base64URL )
		.then( function ( image ) {
			let stream = canvasFromImage( image ).canvas.jpegStream( streamParams );
			resolve( stream );
		}, reject );
}