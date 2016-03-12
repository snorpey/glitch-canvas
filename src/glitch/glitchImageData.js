import isImageData from '../util/isImageData';
import base64ToByteArray from './base64ToByteArray';
import glitchByteArray from './glitchByteArray';
import byteArrayToBase64 from './byteArrayToBase64';

export default function ( imageData, base64URL, params ) {
	if ( isImageData( imageData ) ) {
		let byteArray = base64ToByteArray( base64URL );
		let glitchedByteArray = glitchByteArray( byteArray, params.seed, params.amount, params.iterations );
		let glitchedBase64URL = byteArrayToBase64( glitchedByteArray );
		return glitchedBase64URL;
	} else {
		throw new Error( 'glitchImageData: imageData seems to be corrupt.' );
		return;
	}
}