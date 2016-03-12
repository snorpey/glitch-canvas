'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (stream, resolve, reject) {
	if (stream instanceof Readable) {
		(function () {
			var bufferContent = [];

			stream.on('data', function (chunk) {
				bufferContent.push(chunk);
			});

			stream.on('end', function () {
				try {
					var buffer = Buffer.concat(bufferContent);
					var image = new Image();
					image.src = buffer;

					var canvas = new _canvasBrowserify2.default(image.width, image.height);
					var ctx = canvas.getContext('2d');

					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

					resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
				} catch (err) {
					reject(err);
				}
			});
		})();
	} else {
		reject(new Error("Can't work with the buffer object provided."));
	}
};

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Readable = _stream2.default.Readable;
// https://github.com/Automattic/node-canvas#imagesrcbuffer

var Image = _canvasBrowserify2.default.Image;

;
module.exports = exports['default'];