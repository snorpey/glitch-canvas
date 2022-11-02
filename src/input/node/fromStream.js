import stream from 'stream';
// https://github.com/Automattic/node-canvas#imagesrcbuffer
import Canvas from '../../util/canvas.js';

const Readable = stream.Readable;
const Image = Canvas.Image;

export default function (stream, resolve, reject) {
	if (stream instanceof Readable) {
		const bufferContent = [];

		stream.on('data', chunk => {
			bufferContent.push(chunk);
		});

		stream.on('end', () => {
			try {
				const buffer = Buffer.concat(bufferContent);
				const image = new Image();
				image.src = buffer;

				const canvas = new Canvas(image.width, image.height);
				const ctx = canvas.getContext('2d');

				ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

				resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
			} catch (err) {
				reject(err);
			}
		});
	} else {
		reject(new Error("Can't work with the buffer object provided."));
	}
}
