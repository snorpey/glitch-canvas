'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (base64URL) {
	return new Promise(function (resolve, reject) {
		var image = new _canvasBrowserify.Image();

		image.onload = function () {
			resolve(image);
		};

		image.onerror = function (err) {
			reject(err);
		};

		image.src = base64URL;
	});
};

var _canvasBrowserify = require('canvas-browserify');

module.exports = exports['default'];