'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// constructing an object that allows for a chained interface.
// for example stuff like:
//
// glitch( params )
//     .fromBuffer( buffer )
//     .toImageData()
//
// etc...
//

exports.default = function (params) {
	params = (0, _sanitizeInput2.default)(params);

	var inputFn = undefined;
	var outputFn = undefined;

	var api = {
		getParams: getParams,
		getInput: getInput,
		getOutput: getOutput
	};

	var inputMethods = {
		fromBuffer: fromBuffer,
		fromImageData: fromImageData,
		fromStream: fromStream
	};

	var outputMethods = {
		toBuffer: toBuffer,
		toDataURL: toDataURL,
		toImageData: toImageData,
		toPNGStream: toPNGStream,
		toJPGStream: toJPGStream,
		toJPEGStream: toJPEGStream
	};

	function getParams() {
		return params;
	}

	function getInput() {
		var result = _extends({}, api);

		if (!inputFn) {
			_extends(result, inputMethods);
		}

		return result;
	}

	function getOutput() {
		var result = _extends({}, api);

		if (!outputFn) {
			_extends(result, outputMethods);
		}

		return result;
	}

	function noTransform(x) {
		return x;
	}

	function fromBuffer(inputOptions) {
		return setInput(_fromBuffer2.default, inputOptions);
	}
	function fromStream(inputOptions) {
		return setInput(_fromStream2.default, inputOptions, true);
	}
	function fromImageData(inputOptions) {
		return setInput(noTransform, inputOptions);
	}

	function toBuffer(outputOptions) {
		return setOutput(_toBuffer2.default, outputOptions, true);
	}
	function toDataURL(outputOptions) {
		return setOutput(noTransform, outputOptions);
	}
	function toImageData(outputOptions) {
		return setOutput(_toImageData2.default, outputOptions, true);
	}
	function toPNGStream(outputOptions) {
		return setOutput(_toPNGStream2.default, outputOptions, true);
	}
	function toJPGStream(outputOptions) {
		return setOutput(_toJPGStream2.default, outputOptions, true);
	}
	function toJPEGStream(outputOptions) {
		return setOutput(_toJPGStream2.default, outputOptions, true);
	}

	function setInput(fn, inputOptions, canResolve) {
		inputFn = function inputFn() {
			return new Promise(function (resolve, reject) {
				if (canResolve) {
					fn(inputOptions, resolve, reject);
				} else {
					if (fn === noTransform) {
						resolve(inputOptions);
					} else {
						try {
							resolve(fn(inputOptions, resolve, reject));
						} catch (err) {
							reject(err);
						}
					}
				}
			});
		};

		if (isReady()) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput(fn, outputOptions, canResolve) {
		outputFn = function outputFn(base64URL) {
			return new Promise(function (resolve, reject) {
				if (canResolve) {
					fn(base64URL, outputOptions, resolve, reject);
				} else {
					if (fn === noTransform) {
						resolve(base64URL);
					} else {
						fn(base64URL, outputOptions).then(resolve, reject);
					}
				}
			});
		};

		if (isReady()) {
			return getResult();
		} else {
			return getInput();
		}
	}

	function isReady() {
		return inputFn && outputFn;
	}

	function getResult() {
		return new Promise(function (resolve, reject) {
			inputFn().then(function (imageData) {
				return glitch(imageData, params);
			}, reject).then(function (base64URL) {
				outputFn(base64URL).then(resolve, reject);
			}, reject);
		});
	}

	function glitch(imageData, params) {
		return new Promise(function (resolve, reject) {
			(0, _imageDataToBase2.default)(imageData, params.quality).then(function (base64URL) {
				try {
					resolve((0, _glitchImageData2.default)(imageData, base64URL, params));
				} catch (err) {
					reject(err);
				}
			}, reject);
		});
	}

	return getInput();
};

var _sanitizeInput = require('./input/sanitizeInput');

var _sanitizeInput2 = _interopRequireDefault(_sanitizeInput);

var _fromBuffer = require('./input/node/fromBuffer');

var _fromBuffer2 = _interopRequireDefault(_fromBuffer);

var _fromStream = require('./input/node/fromStream');

var _fromStream2 = _interopRequireDefault(_fromStream);

var _toBuffer = require('./output/node/toBuffer');

var _toBuffer2 = _interopRequireDefault(_toBuffer);

var _toImageData = require('./output/toImageData');

var _toImageData2 = _interopRequireDefault(_toImageData);

var _toPNGStream = require('./output/node/toPNGStream');

var _toPNGStream2 = _interopRequireDefault(_toPNGStream);

var _toJPGStream = require('./output/node/toJPGStream');

var _toJPGStream2 = _interopRequireDefault(_toJPGStream);

var _imageDataToBase = require('./glitch/node/imageDataToBase64');

var _imageDataToBase2 = _interopRequireDefault(_imageDataToBase);

var _glitchImageData = require('./glitch/glitchImageData');

var _glitchImageData2 = _interopRequireDefault(_glitchImageData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];