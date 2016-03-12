'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (imageData) {
	if ((0, _isImageData2.default)(imageData)) {
		if (typeof Uint8ClampedArray === 'undefined') {
			if (typeof window === 'undefined') {
				throw new Error("Can't copy imageData in webworker without Uint8ClampedArray support.");
				return imageData;
			} else {

				return copyImageDataWithCanvas(imageData);
			}
		} else {
			var clampedArray = new Uint8ClampedArray(imageData.data);

			if (typeof ImageData === 'undefined') {
				// http://stackoverflow.com/a/15238036/229189
				return {
					width: imageData.width,
					height: imageData.height,
					data: clampedArray
				};
			} else {
				// http://stackoverflow.com/a/15908922/229189#comment57192591_15908922
				var result = undefined;

				try {
					result = new ImageData(clampedArray, imageData.width, imageData.height);
				} catch (err) {
					if (typeof window === 'undefined') {
						throw new Error("Can't copy imageData in webworker without proper ImageData() support.");
						result = imageData;
					} else {
						result = copyImageDataWithCanvas(imageData);
					}
				}

				return result;
			}
		}
	} else {
		throw new Error('Given imageData object is not useable.');
		return;
	}
};

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

var _isImageData = require('../util/isImageData');

var _isImageData2 = _interopRequireDefault(_isImageData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// http://stackoverflow.com/a/11918126/229189
function copyImageDataWithCanvas(imageData) {
	var canvas = (0, _canvasBrowserify2.default)(imageData.width, imageData.height);
	var ctx = canvas.getContext('2d');
	ctx.putImageData(imageData, 0, 0);

	return ctx.getImageData(0, 0, imageData.width, imageData.height);
}
module.exports = exports['default'];