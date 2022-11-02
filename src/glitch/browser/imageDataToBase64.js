import Canvas from '../../util/canvas.js';
import isImageData from '../../util/isImageData';

export default function (imageData, quality) {
	return new Promise((resolve, reject) => {
		if (isImageData(imageData)) {
			const canvas = new Canvas(imageData.width, imageData.height);
			const ctx = canvas.getContext('2d');
			ctx.putImageData(imageData, 0, 0);

			const base64URL = canvas.toDataURL('image/jpeg', quality / 100);

			resolve(base64URL);
		} else {
			reject(new Error('object is not valid imageData'));
		}
	});
}
