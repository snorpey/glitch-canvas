'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (buffer) {
	if (buffer instanceof Buffer) {
		var image = new Image();
		image.src = buffer;

		var canvas = new _canvasBrowserify2.default(image.width, image.height);
		var ctx = canvas.getContext('2d');

		ctx.drawImage(image, 0, 0, image.width, image.height);

		return ctx.getImageData(0, 0, canvas.width, canvas.height);
	} else {
		throw new Error("Can't work with the buffer object provided.");
		return;
	}
};

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Image = _canvasBrowserify2.default.Image; // https://github.com/Automattic/node-canvas#imagesrcbuffer


;
module.exports = exports['default'];