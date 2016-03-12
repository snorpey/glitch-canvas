'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (image) {
	var size = (0, _getImageSize2.default)(image);
	var canvas = new _canvasBrowserify2.default(size.width, size.height);
	var ctx = canvas.getContext('2d');

	ctx.drawImage(image, 0, 0, size.width, size.height);

	return {
		canvas: canvas,
		ctx: ctx
	};
};

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

var _getImageSize = require('./getImageSize');

var _getImageSize2 = _interopRequireDefault(_getImageSize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];