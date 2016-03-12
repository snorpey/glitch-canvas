'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (base64URL, options, resolve, reject) {
	(0, _loadBase64Image2.default)(base64URL).then(function (image) {
		var stream = (0, _canvasFromImage2.default)(image).canvas.pngStream();
		resolve(stream);
	}, function (err) {
		reject(err);
	});
};

var _loadBase64Image = require('../../util/loadBase64Image');

var _loadBase64Image2 = _interopRequireDefault(_loadBase64Image);

var _canvasFromImage = require('../../util/canvasFromImage');

var _canvasFromImage2 = _interopRequireDefault(_canvasFromImage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default']; // https://github.com/Automattic/node-canvas#canvaspngstream