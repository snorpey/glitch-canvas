import isImageData from '../util/isImageData';
import base64ToByteArray from './base64ToByteArray';
import glitchByteArray from './glitchByteArray';
import byteArrayToBase64 from './byteArrayToBase64';

export default function (imageData, base64URL, params) {
	if (isImageData(imageData)) {
		const byteArray = base64ToByteArray(base64URL);
		const glitchedByteArray = glitchByteArray(
			byteArray,
			params.seed,
			params.amount,
			params.iterations
		);
		const glitchedBase64URL = byteArrayToBase64(glitchedByteArray);
		return glitchedBase64URL;
	} else {
		throw new Error('glitchImageData: imageData seems to be corrupt.');
		return;
	}
}
