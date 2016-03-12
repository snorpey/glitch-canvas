'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (imageData, base64URL, params) {
	if ((0, _isImageData2.default)(imageData)) {
		var byteArray = (0, _base64ToByteArray2.default)(base64URL);
		var glitchedByteArray = (0, _glitchByteArray2.default)(byteArray, params.seed, params.amount, params.iterations);
		var glitchedBase64URL = (0, _byteArrayToBase2.default)(glitchedByteArray);
		return glitchedBase64URL;
	} else {
		throw new Error('glitchImageData: imageData seems to be corrupt.');
		return;
	}
};

var _isImageData = require('../util/isImageData');

var _isImageData2 = _interopRequireDefault(_isImageData);

var _base64ToByteArray = require('./base64ToByteArray');

var _base64ToByteArray2 = _interopRequireDefault(_base64ToByteArray);

var _glitchByteArray = require('./glitchByteArray');

var _glitchByteArray2 = _interopRequireDefault(_glitchByteArray);

var _byteArrayToBase = require('./byteArrayToBase64');

var _byteArrayToBase2 = _interopRequireDefault(_byteArrayToBase);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];