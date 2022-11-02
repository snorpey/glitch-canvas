import Canvas from '../../util/canvas.js';
import isImageData from '../../util/isImageData';

export default function (imageData, quality) {
	return new Promise((resolve, reject) => {
		if (isImageData(imageData)) {
			const canvas = new Canvas(imageData.width, imageData.height);
			const ctx = canvas.getContext('2d');
			ctx.putImageData(imageData, 0, 0);

			let base64URL = canvas.toDataURL('image/jpeg', quality / 100);

			switch (base64URL.length % 4) {
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

			resolve(base64URL);
		} else {
			reject(new Error('object is not valid imageData'));
		}
	});
}
