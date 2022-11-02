import Canvas from './canvas.js';
import getImageSize from './getImageSize';

export default function (image) {
	const size = getImageSize(image);
	const canvas = new Canvas(size.width, size.height);
	const ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0, size.width, size.height);

	return {
		canvas: canvas,
		ctx: ctx,
	};
}
