(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('stream')) :
	typeof define === 'function' && define.amd ? define(['stream'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.glitch = factory(global.stream));
}(this, (function (stream) { 'use strict';

	function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

	var stream__default = /*#__PURE__*/_interopDefaultLegacy(stream);

	function clamp (value, min, max) {
		return value < min ? min : value > max ? max : value;
	}

	function clone (obj) {
		var result = false;

		if (typeof obj !== 'undefined') {
			try {
				result = JSON.parse(JSON.stringify(obj));
			} catch (e) {}
		}

		return result;
	}

	var defaultParams = {
		amount: 35,
		iterations: 20,
		quality: 30,
		seed: 25,
	};

	function sanitizeInput (params) {
		params = clone(params);

		if (typeof params !== 'object') {
			params = {};
		}

		Object.keys(defaultParams)
			.filter(function (key) { return key !== 'iterations'; })
			.forEach(function (key) {
				if (typeof params[key] !== 'number' || isNaN(params[key])) {
					params[key] = defaultParams[key];
				} else {
					params[key] = clamp(params[key], 0, 100);
				}

				params[key] = Math.round(params[key]);
			});

		if (
			typeof params.iterations !== 'number' ||
			isNaN(params.iterations) ||
			params.iterations <= 0
		) {
			params.iterations = defaultParams.iterations;
		}

		params.iterations = Math.round(params.iterations);

		return params;
	}

	var ref = require('canvas');
	var createCanvas = ref.createCanvas;
	var Image$3 = ref.Image;

	var Canvas = function Canvas(width, height) {
		if ( width === void 0 ) width = 300;
		if ( height === void 0 ) height = 150;

		this.canvasEl = createCanvas(width, height);
		this.canvasEl.width = width;
		this.canvasEl.height = height;
		this.ctx = this.canvasEl.getContext('2d');
	};

	var prototypeAccessors = { width: { configurable: true },height: { configurable: true } };

	Canvas.prototype.getContext = function getContext () {
		return this.ctx;
	};

	Canvas.prototype.toDataURL = function toDataURL (type, encoderOptions, cb) {
		if (typeof cb === 'function') {
			cb(this.canvasEl.toDataURL(type, encoderOptions));
		} else {
			return this.canvasEl.toDataURL(type, encoderOptions);
		}
	};

	Canvas.prototype.toBuffer = function toBuffer (params) {
		return this.canvasEl.toBuffer(params);
	};

	Canvas.prototype.pngStream = function pngStream (params) {
		return this.canvasEl.createPNGStream(params);
	};

	Canvas.prototype.jpgStream = function jpgStream (params) {
		return this.canvasEl.createJPEGStream(params);
	};

	Canvas.prototype.jpegStream = function jpegStream (params) {
		return this.canvasEl.createJPEGStream(params);
	};

	prototypeAccessors.width.get = function () {
		return this.canvasEl.width;
	};

	prototypeAccessors.width.set = function (newWidth) {
		this.canvasEl.width = newWidth;
	};

	prototypeAccessors.height.get = function () {
		return this.canvasEl.height;
	};

	prototypeAccessors.height.set = function (newHeight) {
		this.canvasEl.height = newHeight;
	};

	Object.defineProperties( Canvas.prototype, prototypeAccessors );

	Canvas.Image = Image$3;

	// https://github.com/Automattic/node-canvas#imagesrcbuffer

	var Image$2 = Canvas.Image;

	function fromBufferToImageData (buffer) {
		if (buffer instanceof Buffer) {
			var image = new Image$2();
			image.src = buffer;

			var canvas = new Canvas(image.width, image.height);
			var ctx = canvas.getContext('2d');

			ctx.drawImage(image, 0, 0, image.width, image.height);

			return ctx.getImageData(0, 0, canvas.width, canvas.height);
		} else {
			throw new Error("Can't work with the buffer object provided.");
		}
	}

	var Readable = stream__default['default'].Readable;
	var Image$1 = Canvas.Image;

	function fromStreamToImageData (stream, resolve, reject) {
		if (stream instanceof Readable) {
			var bufferContent = [];

			stream.on('data', function (chunk) {
				bufferContent.push(chunk);
			});

			stream.on('end', function () {
				try {
					var buffer = Buffer.concat(bufferContent);
					var image = new Image$1();
					image.src = buffer;

					var canvas = new Canvas(image.width, image.height);
					var ctx = canvas.getContext('2d');

					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

					resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
				} catch (err) {
					reject(err);
				}
			});
		} else {
			reject(new Error("Can't work with the buffer object provided."));
		}
	}

	var Image = Canvas.Image;

	function loadBase64Image (base64URL) {
		return new Promise(function (resolve, reject) {
			var image = new Image();

			image.onload = function () {
				resolve(image);
			};

			image.onerror = reject;

			try {
				image.src = base64URL;
			} catch (err) {
				reject(err);
			}
		});
	}

	function getImageSize (image) {
		return {
			width: image.width || image.naturalWidth,
			height: image.height || image.naturalHeight,
		};
	}

	function canvasFromImage (image) {
		var size = getImageSize(image);
		var canvas = new Canvas(size.width, size.height);
		var ctx = canvas.getContext('2d');

		ctx.drawImage(image, 0, 0, size.width, size.height);

		return {
			canvas: canvas,
			ctx: ctx,
		};
	}

	function base64URLToBuffer (base64URL, options, resolve, reject) {
		loadBase64Image(base64URL).then(function (image) {
			var buffer = canvasFromImage(image).canvas.toBuffer();
			resolve(buffer);
		}, reject);
	}

	function base64URLToImageData (base64URL, options, resolve, reject) {
		loadBase64Image(base64URL).then(function (image) {
			var size = getImageSize(image);
			var imageData = canvasFromImage(image).ctx.getImageData(
				0,
				0,
				size.width,
				size.height
			);

			if (!imageData.width) {
				imageData.width = size.width;
			}

			if (!imageData.height) {
				imageData.height = size.height;
			}

			resolve(imageData);
		}, reject);
	}

	// https://github.com/Automattic/node-canvas#canvaspngstream

	function base64URLToPNGStream (base64URL, options, resolve, reject) {
		loadBase64Image(base64URL).then(
			function (image) {
				var stream = canvasFromImage(image).canvas.pngStream();
				resolve(stream);
			},
			function (err) {
				reject(err);
			}
		);
	}

	// https://github.com/Automattic/node-canvas#canvasjpegstream-and-canvassyncjpegstream

	function base64URLToJPGStream (base64URL, options, resolve, reject) {
		options = options || {};

		var streamParams = {
			bufsize: options.bufsize || 4096,
			quality: options.quality || 75,
			progressive: options.progressive || false,
		};

		loadBase64Image(base64URL).then(function (image) {
			var c = canvasFromImage(image);
			var stream = c.canvas.jpegStream(streamParams);
			resolve(stream);
		}, reject);
	}

	function isImageData (imageData) {
		return (
			imageData &&
			typeof imageData.width === 'number' &&
			typeof imageData.height === 'number' &&
			imageData.data &&
			typeof imageData.data.length === 'number' &&
			typeof imageData.data === 'object'
		);
	}

	function imageDataToBase64 (imageData, quality) {
		return new Promise(function (resolve, reject) {
			if (isImageData(imageData)) {
				var canvas = new Canvas(imageData.width, imageData.height);
				var ctx = canvas.getContext('2d');
				ctx.putImageData(imageData, 0, 0);

				var base64URL = canvas.toDataURL('image/jpeg', quality / 100);

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
			} else {
				reject(new Error('object is not valid imageData'));
			}
		});
	}

	var base64Chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	var base64Map$1 = base64Chars.split('');
	var reversedBase64Map$1 = {};

	base64Map$1.forEach(function (val, key) {
		reversedBase64Map$1[val] = key;
	});

	var maps = {
		base64Map: base64Map$1,
		reversedBase64Map: reversedBase64Map$1,
	};

	var reversedBase64Map = maps.reversedBase64Map;

	// https://github.com/mutaphysis/smackmyglitchupjs/blob/master/glitch.html
	// base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes
	function base64ToByteArray (base64URL) {
		var result = [];
		var prev;

		var srcURL = base64URL.replace('data:image/jpeg;base64,', '');

		for (var i = 0, len = srcURL.length; i < len; i++) {
			srcURL[i];
			var currentChar = reversedBase64Map[srcURL[i]];
			var digitNum = i % 4;

			switch (digitNum) {
				// case 0: first digit - do nothing, not enough info to work with
				case 1: // second digit
					result.push((prev << 2) | (currentChar >> 4));
					break;

				case 2: // third digit
					result.push(((prev & 0x0f) << 4) | (currentChar >> 2));
					break;

				case 3: // fourth digit
					result.push(((prev & 3) << 6) | currentChar);
					break;
			}

			prev = currentChar;
		}

		return result;
	}

	// http://stackoverflow.com/a/10424014/229189

	function jpgHeaderLength (byteArr) {
		var result = 417;

		// https://en.wikipedia.org/wiki/JPEG#Syntax_and_structure
		// looks for the first occurence of 0xFF, 0xDA in the byteArray
		// which is the start of scan
		for (var i = 0, len = byteArr.length; i < len; i++) {
			if (byteArr[i] === 0xff && byteArr[i + 1] === 0xda) {
				result = i + 2;
				break;
			}
		}

		return result;
	}

	function glitchByteArray (byteArray, seed, amount, iterationCount) {
		var headerLength = jpgHeaderLength(byteArray);
		var maxIndex = byteArray.length - headerLength - 4;

		var amountPercent = amount / 100;
		var seedPercent = seed / 100;

		for (
			var iterationIndex = 0;
			iterationIndex < iterationCount;
			iterationIndex++
		) {
			var minPixelIndex =
				((maxIndex / iterationCount) * iterationIndex) | 0;
			var maxPixelIndex =
				((maxIndex / iterationCount) * (iterationIndex + 1)) | 0;

			var delta = maxPixelIndex - minPixelIndex;
			var pixelIndex = (minPixelIndex + delta * seedPercent) | 0;

			if (pixelIndex > maxIndex) {
				pixelIndex = maxIndex;
			}

			var indexInByteArray = ~~(headerLength + pixelIndex);

			byteArray[indexInByteArray] = ~~(amountPercent * 256);
		}

		return byteArray;
	}

	var base64Map = maps.base64Map;

	function byteArrayToBase64 (byteArray) {
		var result = ['data:image/jpeg;base64,'];
		var byteNum;
		var previousByte;

		for (var i = 0, len = byteArray.length; i < len; i++) {
			var currentByte = byteArray[i];
			byteNum = i % 3;

			switch (byteNum) {
				case 0: // first byte
					result.push(base64Map[currentByte >> 2]);
					break;
				case 1: // second byte
					result.push(
						base64Map[((previousByte & 3) << 4) | (currentByte >> 4)]
					);
					break;
				case 2: // third byte
					result.push(
						base64Map[((previousByte & 0x0f) << 2) | (currentByte >> 6)]
					);
					result.push(base64Map[currentByte & 0x3f]);
					break;
			}

			previousByte = currentByte;
		}

		if (byteNum === 0) {
			result.push(base64Map[(previousByte & 3) << 4]);
			result.push('==');
		} else {
			if (byteNum === 1) {
				result.push(base64Map[(previousByte & 0x0f) << 2]);
				result.push('=');
			}
		}

		return result.join('');
	}

	function glitchImageData (imageData, base64URL, params) {
		if (isImageData(imageData)) {
			var byteArray = base64ToByteArray(base64URL);
			var glitchedByteArray = glitchByteArray(
				byteArray,
				params.seed,
				params.amount,
				params.iterations
			);
			var glitchedBase64URL = byteArrayToBase64(glitchedByteArray);
			return glitchedBase64URL;
		} else {
			throw new Error('glitchImageData: imageData seems to be corrupt.');
		}
	}

	// import objectAssign from 'object-assign'
	var objectAssign = Object.assign;

	// constructing an object that allows for a chained interface.
	// for example stuff like:
	//
	// glitch( params )
	//     .fromBuffer( buffer )
	//     .toImageData()
	//
	// etc...
	//

	function index (params) {
		params = sanitizeInput(params);

		var inputFn;
		var outputFn;

		var api = { getParams: getParams, getInput: getInput, getOutput: getOutput };
		var inputMethods = { fromBuffer: fromBuffer, fromImageData: fromImageData, fromStream: fromStream };

		var outputMethods = {
			toBuffer: toBuffer,
			toDataURL: toDataURL,
			toImageData: toImageData,
			toPNGStream: toPNGStream,
			toJPGStream: toJPGStream,
			toJPEGStream: toJPEGStream,
		};

		function getParams() {
			return params;
		}

		function getInput() {
			var result = objectAssign({}, api);

			if (!inputFn) {
				objectAssign(result, inputMethods);
			}

			return result;
		}

		function getOutput() {
			var result = objectAssign({}, api);

			if (!outputFn) {
				objectAssign(result, outputMethods);
			}

			return result;
		}

		function noTransform(x) {
			return x;
		}

		function fromBuffer(inputOptions) {
			return setInput(fromBufferToImageData, inputOptions);
		}
		function fromStream(inputOptions) {
			return setInput(fromStreamToImageData, inputOptions, true);
		}
		function fromImageData(inputOptions) {
			return setInput(noTransform, inputOptions);
		}

		function toBuffer(outputOptions) {
			return setOutput(base64URLToBuffer, outputOptions, true);
		}
		function toDataURL(outputOptions) {
			return setOutput(noTransform, outputOptions);
		}
		function toImageData(outputOptions) {
			return setOutput(base64URLToImageData, outputOptions, true);
		}
		function toPNGStream(outputOptions) {
			return setOutput(base64URLToPNGStream, outputOptions, true);
		}
		function toJPGStream(outputOptions) {
			return setOutput(base64URLToJPGStream, outputOptions, true);
		}
		function toJPEGStream(outputOptions) {
			return setOutput(base64URLToJPGStream, outputOptions, true);
		}

		function setInput(fn, inputOptions, canResolve) {
			inputFn = function () {
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
			outputFn = function (base64URL) {
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
				inputFn()
					.then(function (imageData) {
						return glitch(imageData, params);
					}, reject)
					.then(function (base64URL) {
						outputFn(base64URL).then(resolve, reject);
					}, reject);
			});
		}

		function glitch(imageData, params) {
			return new Promise(function (resolve, reject) {
				imageDataToBase64(imageData, params.quality).then(function (base64URL) {
					try {
						resolve(glitchImageData(imageData, base64URL, params));
					} catch (err) {
						reject(err);
					}
				}, reject);
			});
		}

		return getInput();
	}

	return index;

})));
