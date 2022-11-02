(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.glitch = factory());
}(this, (function () { 'use strict';

	function clamp (value, min, max) {
		return value < min ? min : value > max ? max : value;
	}

	function clone (obj) {
		let result = false;

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
			.filter(key => key !== 'iterations')
			.forEach(key => {
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

	class Canvas {
		constructor(width = 300, height = 150) {
			if (typeof window === 'undefined') {
				this.canvasEl = { width, height };
				this.ctx = null;
			} else {
				this.canvasEl = document.createElement('canvas');
				this.canvasEl.width = width;
				this.canvasEl.height = height;
				this.ctx = this.canvasEl.getContext('2d');
			}
		}

		getContext() {
			return this.ctx;
		}

		toDataURL(type, encoderOptions, cb) {
			if (typeof cb === 'function') {
				cb(this.canvasEl.toDataURL(type, encoderOptions));
			} else {
				return this.canvasEl.toDataURL(type, encoderOptions);
			}
		}

		get width() {
			return this.canvasEl.width;
		}

		set width(newWidth) {
			this.canvasEl.width = newWidth;
		}

		get height() {
			return this.canvasEl.height;
		}

		set height(newHeight) {
			this.canvasEl.height = newHeight;
		}
	}

	if (typeof window !== 'undefined') {
		Canvas.Image = Image;
	}

	function imageToImageData (image) {
		if (image instanceof HTMLImageElement) {
			// http://stackoverflow.com/a/3016076/229189
			if (
				!image.naturalWidth ||
				!image.naturalHeight ||
				image.complete === false
			) {
				throw new Error(
					"This this image hasn't finished loading: " + image.src
				);
			}

			const canvas = new Canvas(image.naturalWidth, image.naturalHeight);
			const ctx = canvas.getContext('2d');

			ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

			const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

			if (imageData.data && imageData.data.length) {
				if (typeof imageData.width === 'undefined') {
					imageData.width = image.naturalWidth;
				}

				if (typeof imageData.height === 'undefined') {
					imageData.height = image.naturalHeight;
				}
			}

			return imageData;
		} else {
			throw new Error('This object does not seem to be an image.');
		}
	}

	const Image$1 = Canvas.Image;

	function loadBase64Image (base64URL) {
		return new Promise((resolve, reject) => {
			const image = new Image$1();

			image.onload = () => {
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

	function base64URLToImage (base64URL, opts, resolve, reject) {
		loadBase64Image(base64URL).then(resolve, reject);
	}

	function getImageSize (image) {
		return {
			width: image.width || image.naturalWidth,
			height: image.height || image.naturalHeight,
		};
	}

	function canvasFromImage (image) {
		const size = getImageSize(image);
		const canvas = new Canvas(size.width, size.height);
		const ctx = canvas.getContext('2d');

		ctx.drawImage(image, 0, 0, size.width, size.height);

		return {
			canvas: canvas,
			ctx: ctx,
		};
	}

	function base64URLToImageData (base64URL, options, resolve, reject) {
		loadBase64Image(base64URL).then(image => {
			const size = getImageSize(image);
			const imageData = canvasFromImage(image).ctx.getImageData(
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
		return new Promise((resolve, reject) => {
			if (isImageData(imageData)) {
				const canvas = new Canvas(imageData.width, imageData.height);
				const ctx = canvas.getContext('2d');
				ctx.putImageData(imageData, 0, 0);

				const base64URL = canvas.toDataURL('image/jpeg', quality / 100);

				resolve(base64URL);
			} else {
				reject(new Error('object is not valid imageData'));
			}
		});
	}

	// import objectAssign from 'object-assign'
	const objectAssign = Object.assign;

	// constructing an object that allows for a chained interface.
	// for example stuff like:
	//
	// glitch( params )
	//     .toImage( img )
	//     .toImageData()
	//
	// etc...

	function glitch(params) {
		params = sanitizeInput(params);

		let inputFn;
		let outputFn;

		const worker = new Worker(URL.createObjectURL(new Blob(["function isImageData (imageData) {\n\treturn (\n\t\timageData &&\n\t\ttypeof imageData.width === 'number' &&\n\t\ttypeof imageData.height === 'number' &&\n\t\timageData.data &&\n\t\ttypeof imageData.data.length === 'number' &&\n\t\ttypeof imageData.data === 'object'\n\t);\n}\n\nconst base64Chars =\n\t'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';\nconst base64Map$1 = base64Chars.split('');\nconst reversedBase64Map$1 = {};\n\nbase64Map$1.forEach((val, key) => {\n\treversedBase64Map$1[val] = key;\n});\n\nvar maps = {\n\tbase64Map: base64Map$1,\n\treversedBase64Map: reversedBase64Map$1,\n};\n\nconst reversedBase64Map = maps.reversedBase64Map;\n\n// https://github.com/mutaphysis/smackmyglitchupjs/blob/master/glitch.html\n// base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes\nfunction base64ToByteArray (base64URL) {\n\tconst result = [];\n\tlet prev;\n\n\tconst srcURL = base64URL.replace('data:image/jpeg;base64,', '');\n\n\tfor (var i = 0, len = srcURL.length; i < len; i++) {\n\t\tsrcURL[i];\n\t\tconst currentChar = reversedBase64Map[srcURL[i]];\n\t\tconst digitNum = i % 4;\n\n\t\tswitch (digitNum) {\n\t\t\t// case 0: first digit - do nothing, not enough info to work with\n\t\t\tcase 1: // second digit\n\t\t\t\tresult.push((prev << 2) | (currentChar >> 4));\n\t\t\t\tbreak;\n\n\t\t\tcase 2: // third digit\n\t\t\t\tresult.push(((prev & 0x0f) << 4) | (currentChar >> 2));\n\t\t\t\tbreak;\n\n\t\t\tcase 3: // fourth digit\n\t\t\t\tresult.push(((prev & 3) << 6) | currentChar);\n\t\t\t\tbreak;\n\t\t}\n\n\t\tprev = currentChar;\n\t}\n\n\treturn result;\n}\n\n// http://stackoverflow.com/a/10424014/229189\n\nfunction jpgHeaderLength (byteArr) {\n\tlet result = 417;\n\n\t// https://en.wikipedia.org/wiki/JPEG#Syntax_and_structure\n\t// looks for the first occurence of 0xFF, 0xDA in the byteArray\n\t// which is the start of scan\n\tfor (let i = 0, len = byteArr.length; i < len; i++) {\n\t\tif (byteArr[i] === 0xff && byteArr[i + 1] === 0xda) {\n\t\t\tresult = i + 2;\n\t\t\tbreak;\n\t\t}\n\t}\n\n\treturn result;\n}\n\nfunction glitchByteArray (byteArray, seed, amount, iterationCount) {\n\tconst headerLength = jpgHeaderLength(byteArray);\n\tconst maxIndex = byteArray.length - headerLength - 4;\n\n\tconst amountPercent = amount / 100;\n\tconst seedPercent = seed / 100;\n\n\tfor (\n\t\tvar iterationIndex = 0;\n\t\titerationIndex < iterationCount;\n\t\titerationIndex++\n\t) {\n\t\tconst minPixelIndex =\n\t\t\t((maxIndex / iterationCount) * iterationIndex) | 0;\n\t\tconst maxPixelIndex =\n\t\t\t((maxIndex / iterationCount) * (iterationIndex + 1)) | 0;\n\n\t\tconst delta = maxPixelIndex - minPixelIndex;\n\t\tlet pixelIndex = (minPixelIndex + delta * seedPercent) | 0;\n\n\t\tif (pixelIndex > maxIndex) {\n\t\t\tpixelIndex = maxIndex;\n\t\t}\n\n\t\tconst indexInByteArray = ~~(headerLength + pixelIndex);\n\n\t\tbyteArray[indexInByteArray] = ~~(amountPercent * 256);\n\t}\n\n\treturn byteArray;\n}\n\nconst base64Map = maps.base64Map;\n\nfunction byteArrayToBase64 (byteArray) {\n\tconst result = ['data:image/jpeg;base64,'];\n\tlet byteNum;\n\tlet previousByte;\n\n\tfor (let i = 0, len = byteArray.length; i < len; i++) {\n\t\tconst currentByte = byteArray[i];\n\t\tbyteNum = i % 3;\n\n\t\tswitch (byteNum) {\n\t\t\tcase 0: // first byte\n\t\t\t\tresult.push(base64Map[currentByte >> 2]);\n\t\t\t\tbreak;\n\t\t\tcase 1: // second byte\n\t\t\t\tresult.push(\n\t\t\t\t\tbase64Map[((previousByte & 3) << 4) | (currentByte >> 4)]\n\t\t\t\t);\n\t\t\t\tbreak;\n\t\t\tcase 2: // third byte\n\t\t\t\tresult.push(\n\t\t\t\t\tbase64Map[((previousByte & 0x0f) << 2) | (currentByte >> 6)]\n\t\t\t\t);\n\t\t\t\tresult.push(base64Map[currentByte & 0x3f]);\n\t\t\t\tbreak;\n\t\t}\n\n\t\tpreviousByte = currentByte;\n\t}\n\n\tif (byteNum === 0) {\n\t\tresult.push(base64Map[(previousByte & 3) << 4]);\n\t\tresult.push('==');\n\t} else {\n\t\tif (byteNum === 1) {\n\t\t\tresult.push(base64Map[(previousByte & 0x0f) << 2]);\n\t\t\tresult.push('=');\n\t\t}\n\t}\n\n\treturn result.join('');\n}\n\nfunction glitchImageData (imageData, base64URL, params) {\n\tif (isImageData(imageData)) {\n\t\tconst byteArray = base64ToByteArray(base64URL);\n\t\tconst glitchedByteArray = glitchByteArray(\n\t\t\tbyteArray,\n\t\t\tparams.seed,\n\t\t\tparams.amount,\n\t\t\tparams.iterations\n\t\t);\n\t\tconst glitchedBase64URL = byteArrayToBase64(glitchedByteArray);\n\t\treturn glitchedBase64URL;\n\t} else {\n\t\tthrow new Error('glitchImageData: imageData seems to be corrupt.');\n\t}\n}\n\nonmessage = msg => {\n\tconst imageData = msg.data.imageData;\n\tconst params = msg.data.params;\n\tconst base64URL = msg.data.base64URL;\n\n\tif (imageData && base64URL && params) {\n\t\ttry {\n\t\t\t// phantomjs seems to have some memory loss so we need to make sure\n\t\t\tif (\n\t\t\t\ttypeof imageData.width === 'undefined' &&\n\t\t\t\ttypeof msg.data.imageDataWidth === 'number'\n\t\t\t) {\n\t\t\t\timageData.width = msg.data.imageDataWidth;\n\t\t\t}\n\n\t\t\tif (\n\t\t\t\ttypeof imageData.height === 'undefined' &&\n\t\t\t\ttypeof msg.data.imageDataHeight === 'number'\n\t\t\t) {\n\t\t\t\timageData.height = msg.data.imageDataHeight;\n\t\t\t}\n\n\t\t\tconst glitchedBase64URL = glitchImageData(\n\t\t\t\timageData,\n\t\t\t\tbase64URL,\n\t\t\t\tparams\n\t\t\t);\n\t\t\tsuccess(glitchedBase64URL);\n\t\t} catch (err) {\n\t\t\tfail(err);\n\t\t}\n\t} else {\n\t\tif (msg.data.imageData) {\n\t\t\tfail('Parameters are missing.');\n\t\t} else {\n\t\t\tfail('ImageData is missing.');\n\t\t}\n\t}\n\n\tself.close();\n};\n\nfunction fail(err) {\n\tself.postMessage({ err: err.message || err });\n}\n\nfunction success(base64URL) {\n\tself.postMessage({ base64URL: base64URL });\n}\n"],{type:'text/javascript'})));

		const api = { getParams, getInput, getOutput };
		const inputMethods = { fromImageData, fromImage };
		const outputMethods = { toImage, toDataURL, toImageData };

		function getParams() {
			return params;
		}

		function getInput() {
			const result = objectAssign({}, api);

			if (!inputFn) {
				objectAssign(result, inputMethods);
			}

			return result;
		}

		function getOutput() {
			const result = objectAssign({}, api);

			if (!outputFn) {
				objectAssign(result, outputMethods);
			}

			return result;
		}

		function noTransform(x) {
			return x;
		}

		function fromImage(inputOptions) {
			return setInput(imageToImageData, inputOptions);
		}
		function fromImageData(inputOptions) {
			return setInput(noTransform, inputOptions);
		}

		function toDataURL(outputOptions) {
			return setOutput(noTransform);
		}
		function toImage(outputOptions) {
			return setOutput(base64URLToImage, outputOptions, true);
		}
		function toImageData(outputOptions) {
			return setOutput(base64URLToImageData, outputOptions, true);
		}

		function setInput(fn, inputOptions, canResolve) {
			inputFn = () => {
				return new Promise((resolve, reject) => {
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
			outputFn = base64URL => {
				return new Promise((resolve, reject) => {
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
			return new Promise((resolve, reject) => {
				inputFn()
					.then(imageData => {
						return glitch(imageData, params);
					}, reject)
					.then(base64URL => {
						outputFn(base64URL).then(resolve, reject);
					}, reject);
			});
		}

		function glitch(imageData, params) {
			return new Promise((resolve, reject) => {
				imageDataToBase64(imageData, params.quality)
					.then(base64URL => {
						return glitchInWorker(imageData, base64URL, params);
					}, reject)
					.then(resolve, reject);
			});
		}

		function glitchInWorker(imageData, base64URL, params) {
			return new Promise((resolve, reject) => {
				worker.addEventListener('message', event => {
					if (event.data && event.data.base64URL) {
						resolve(event.data.base64URL);
					} else {
						if (event.data && event.data.err) {
							reject(event.data.err);
						} else {
							reject(event);
						}
					}
				});

				worker.postMessage({
					params: params,
					base64URL: base64URL,
					imageData: imageData,

					// phantomjs tends to forget about those two
					// so we send them separately
					imageDataWidth: imageData.width,
					imageDataHeight: imageData.height,
				});
			});
		}

		return getInput();
	}

	return glitch;

})));
