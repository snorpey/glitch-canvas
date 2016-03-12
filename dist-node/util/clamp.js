"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (value, min, max) {
	return value < min ? min : value > max ? max : value;
};

module.exports = exports['default'];