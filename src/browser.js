import sanitizeInput from './input/sanitizeInput';
import imageToImageData from './input/browser/fromImage';
import base64URLToImage from './output/browser/toImage';
import base64URLToImageData from './output/toImageData';
import imageDataToBase64 from './glitch/browser/imageDataToBase64';
import glitchImageData from './glitch/glitchImageData';
import objectAssign from './util/object-assign.js';

// PROMISE_POLYFILL_HERE

// constructing an object that allows for a chained interface.
// for example stuff like:
//
// glitch( params )
//     .toImage( img )
//     .toImageData()
//
// etc...

export default function glitch(params) {
	params = sanitizeInput(params);

	let inputFn;
	let outputFn;

	const worker = new Worker('workers/glitchWorker.js');

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
