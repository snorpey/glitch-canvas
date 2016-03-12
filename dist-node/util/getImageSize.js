"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (image) {
	return {
		width: image.width || image.naturalWidth,
		height: image.height || image.naturalHeight
	};
};

module.exports = exports['default'];