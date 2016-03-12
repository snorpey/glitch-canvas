'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64Map = base64Chars.split('');
var reversedBase64Map = {};

base64Map.forEach(function (val, key) {
	reversedBase64Map[val] = key;
});

exports.default = {
	map: base64Map,
	reverse: reversedBase64Map
};
module.exports = exports['default'];