// https://github.com/Automattic/node-canvas#canvaspngstream
import loadBase64Image from '../../util/loadBase64Image';
import canvasFromImage from '../../util/canvasFromImage';

export default function (base64URL, options, resolve, reject) {
	loadBase64Image(base64URL).then(
		image => {
			const stream = canvasFromImage(image).canvas.pngStream();
			resolve(stream);
		},
		function (err) {
			reject(err);
		}
	);
}
