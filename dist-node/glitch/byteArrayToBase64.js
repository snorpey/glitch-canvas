'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (byteArray) {
	var result = ['data:image/jpeg;base64,'];
	var byteNum = undefined;
	var currentByte = undefined;
	var previousByte = undefined;

	for (var i = 0, len = byteArray.length; i < len; i++) {
		currentByte = byteArray[i];
		byteNum = i % 3;

		switch (byteNum) {
			case 0:
				// first byte
				result.push(_base64Map.map[currentByte >> 2]);
				break;
			case 1:
				// second byte
				result.push(_base64Map.map[(previousByte & 3) << 4 | currentByte >> 4]);
				break;
			case 2:
				// third byte
				result.push(_base64Map.map[(previousByte & 0x0f) << 2 | currentByte >> 6]);
				result.push(_base64Map.map[currentByte & 0x3f]);
				break;
		}

		previousByte = currentByte;
	}

	if (byteNum === 0) {
		result.push(_base64Map.map[(previousByte & 3) << 4]);
		result.push('==');
	} else {
		if (byteNum === 1) {
			result.push(_base64Map.map[(previousByte & 0x0f) << 2]);
			result.push('=');
		}
	}

	return result.join('');
};

var _base64Map = require('./base64Map');

module.exports = exports['default'];