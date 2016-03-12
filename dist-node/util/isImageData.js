'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (imageData) {
	return imageData && typeof imageData.width === 'number' && typeof imageData.height === 'number' && imageData.data && typeof imageData.data.length === 'number' && _typeof(imageData.data) === 'object';
};

;
module.exports = exports['default'];