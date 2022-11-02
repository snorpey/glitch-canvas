import sanitizeInput from './input/sanitizeInput';
import fromBufferToImageData from './input/node/fromBuffer';
import fromStreamToImageData from './input/node/fromStream';
import base64URLToBuffer from './output/node/toBuffer';
import base64URLToImageData from './output/toImageData';
import base64URLToPNGStream from './output/node/toPNGStream';
import base64URLToJPGStream from './output/node/toJPGStream';
import imageDataToBase64 from './glitch/node/imageDataToBase64';
import glitchImageData from './glitch/glitchImageData';
import objectAssign from './util/object-assign.js';

// constructing an object that allows for a chained interface.
// for example stuff like:
//
// glitch( params )
//     .fromBuffer( buffer )
//     .toImageData()
//
// etc...
//

export default function (params) {
	params = sanitizeInput(params);

	let inputFn;
	let outputFn;

	const api = { getParams, getInput, getOutput };
	const inputMethods = { fromBuffer, fromImageData, fromStream };

	const outputMethods = {
		toBuffer,
		toDataURL,
		toImageData,
		toPNGStream,
		toJPGStream,
		toJPEGStream,
	};

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
			imageDataToBase64(imageData, params.quality).then(base64URL => {
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
