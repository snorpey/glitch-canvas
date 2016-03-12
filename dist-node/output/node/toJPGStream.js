'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (base64URL, options, resolve, reject) {
	options = options || {};

	var streamParams = {
		bufsize: options.bufsize || 4096,
		quality: options.quality || 75,
		progressive: options.progressive || false
	};

	(0, _loadBase64Image2.default)(base64URL).then(function (image) {
		var stream = (0, _canvasFromImage2.default)(image).canvas.jpegStream(streamParams);
		resolve(stream);
	}, reject);
};

var _loadBase64Image = require('../../util/loadBase64Image');

var _loadBase64Image2 = _interopRequireDefault(_loadBase64Image);

var _canvasFromImage = require('../../util/canvasFromImage');

var _canvasFromImage2 = _interopRequireDefault(_canvasFromImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default']; // https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream