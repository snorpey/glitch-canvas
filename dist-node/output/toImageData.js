'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (base64URL, options, resolve, reject) {
	(0, _loadBase64Image2.default)(base64URL).then(function (image) {
		var size = (0, _getImageSize2.default)(image);
		var imageData = (0, _canvasFromImage2.default)(image).ctx.getImageData(0, 0, size.width, size.height);

		if (!imageData.width) {
			imageData.width = size.width;
		}

		if (!imageData.height) {
			imageData.height = size.height;
		}

		resolve(imageData);
	}, reject);
};

var _loadBase64Image = require('../util/loadBase64Image');

var _loadBase64Image2 = _interopRequireDefault(_loadBase64Image);

var _canvasFromImage = require('../util/canvasFromImage');

var _canvasFromImage2 = _interopRequireDefault(_canvasFromImage);

var _getImageSize = require('../util/getImageSize');

var _getImageSize2 = _interopRequireDefault(_getImageSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];