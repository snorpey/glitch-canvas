'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = worker;

var _glitchImageData = require('../glitch/glitchImageData');

var _glitchImageData2 = _interopRequireDefault(_glitchImageData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function worker(self) {
	self.addEventListener('message', function (msg) {
		var imageData = msg.data.imageData;
		var params = msg.data.params;
		var base64URL = msg.data.base64URL;

		if (imageData && base64URL && params) {
			try {
				// phantomjs seems to have some memory loss so we need to make sure
				if (typeof imageData.width === 'undefined' && typeof msg.data.imageDataWidth === 'number') {
					imageData.width = msg.data.imageDataWidth;
				}

				if (typeof imageData.height === 'undefined' && typeof msg.data.imageDataHeight === 'number') {
					imageData.height = msg.data.imageDataHeight;
				}

				var glitchedBase64URL = (0, _glitchImageData2.default)(imageData, base64URL, params);
				success(glitchedBase64URL);
			} catch (err) {
				fail(err);
			}
		} else {
			if (msg.data.imageData) {
				fail('Parameters are missing.');
			} else {
				fail('ImageData is missing.');
			}
		}

		self.close();
	});
}

function fail(err) {
	self.postMessage({ err: err.message || err });
}

function success(base64URL) {
	self.postMessage({ base64URL: base64URL });
}
module.exports = exports['default'];