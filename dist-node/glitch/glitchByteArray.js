'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (byteArray, seed, amount, iterationCount) {
	var headerLength = (0, _jpgHeaderLength2.default)(byteArray);
	var maxIndex = byteArray.length - headerLength - 4;

	var amountPercent = amount / 100;
	var seedPercent = seed / 100;

	for (var iterationIndex = 0; iterationIndex < iterationCount; iterationIndex++) {
		var minPixelIndex = maxIndex / iterationCount * iterationIndex | 0;
		var maxPixelIndex = maxIndex / iterationCount * (iterationIndex + 1) | 0;

		var delta = maxPixelIndex - minPixelIndex;
		var pixelIndex = minPixelIndex + delta * seedPercent | 0;

		if (pixelIndex > maxIndex) {
			pixelIndex = maxIndex;
		}

		var indexInByteArray = ~ ~(headerLength + pixelIndex);

		byteArray[indexInByteArray] = ~ ~(amountPercent * 256);
	}

	return byteArray;
};

var _jpgHeaderLength = require('./jpgHeaderLength');

var _jpgHeaderLength2 = _interopRequireDefault(_jpgHeaderLength);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];