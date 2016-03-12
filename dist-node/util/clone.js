'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (obj) {
	var result = false;

	if (typeof obj !== 'undefined') {

		try {
			result = JSON.parse(JSON.stringify(obj));
		} catch (e) {}
	}

	return result;
};

module.exports = exports['default'];