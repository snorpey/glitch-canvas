// https://github.com/Automattic/node-canvas#imagesrcbuffer
import Canvas from '../../util/canvas.js';

const Image = Canvas.Image;

export default function (buffer) {
	if (buffer instanceof Buffer) {
		const image = new Image();
		image.src = buffer;

		const canvas = new Canvas(image.width, image.height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(image, 0, 0, image.width, image.height);

		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	} else {
		throw new Error("Can't work with the buffer object provided.");
		return;
	}
}
