'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function (imageData, quality) {
	return new Promise(function (resolve, reject) {
		if ((0, _isImageData2.default)(imageData)) {
			var canvas = new _canvasBrowserify2.default(imageData.width, imageData.height);
			var ctx = canvas.getContext('2d');
			ctx.putImageData(imageData, 0, 0);

			canvas.toDataURL('image/jpeg', quality / 100, function (err, base64URL) {
				if (err) {
					reject(err);
				}

				switch (base64URL.length % 4) {
					case 3:
						base64URL += '=';
						break;
					case 2:
						base64URL += '==';
						break;
					case 1:
						base64URL += '===';
						break;
				}

				resolve(base64URL);
			});
		} else {
			reject(new Error('object is not valid imageData'));
		}
	});
};

var _canvasBrowserify = require('canvas-browserify');

var _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify);

var _isImageData = require('../../util/isImageData');

var _isImageData2 = _interopRequireDefault(_isImageData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];