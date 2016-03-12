'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (imageData) {
	var canvas = new _canvasBrowserify2.default(imageData.width, imageData.height);
	var ctx = canvas.getContext('2d');

	ctx.putImageData(imageData, 0, 0);

	return {
		canvas: canvas,
		ctx: ctx
	};
};

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];