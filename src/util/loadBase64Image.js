import Canvas from './canvas.js';

const Image = Canvas.Image;

export default function (base64URL) {
	return new Promise((resolve, reject) => {
		const image = new Image();

		image.onload = () => {
			resolve(image);
		};

		image.onerror = reject;

		try {
			image.src = base64URL;
		} catch (err) {
			reject(err);
		}
	});
}
