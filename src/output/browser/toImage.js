import canvasFromImage from '../../util/loadBase64Image';

export default function ( base64URL, resolve, reject ) {
	loadBase64Image( base64URL )
		.then( resolve, reject );
}