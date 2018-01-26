(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.glitch = factory());
}(this, (function () { 'use strict';

function clamp ( value, min, max ) {
	return value < min ? min : value > max ? max : value;
}

function clone ( obj ) {
	var result = false;
	
	if ( typeof obj !== 'undefined' ) {
		try {
			result = JSON.parse( JSON.stringify( obj ) );
		} catch ( e ) { }
	}
	
	return result;
}

var defaultParams = {
    amount:     35,
    iterations: 20,
    quality:    30,
	seed:       25
};

function sanitizeInput ( params ) {
	
	params = clone( params );

	if ( typeof params !== 'object' ) {
		params = { };
	}

	Object
		.keys( defaultParams )
		.filter( function (key) { return key !== 'iterations'; } )
		.forEach( function (key) {
			if ( typeof params[key] !== 'number' || isNaN( params[key] ) ) {
				params[key] = defaultParams[key];
			} else {
				params[key] = clamp( params[key], 0, 100 );
			}
		
			params[key] = Math.round( params[key] );
		} );

	if (
		typeof params.iterations !== 'number' ||
		isNaN( params.iterations ) || params.iterations <= 0
	) {
		params.iterations = defaultParams.iterations;	
	}

	params.iterations = Math.round( params.iterations );

	return params;
}

var Canvas$1 = function Canvas ( width, height ) {
	if ( width === void 0 ) width = 300;
	if ( height === void 0 ) height = 150;
	
	this.canvasEl = document.createElement( 'canvas' );
	this.canvasEl.width = width;
	this.canvasEl.height = height;
	this.ctx = this.canvasEl.getContext( '2d' );
};

var prototypeAccessors = { width: { configurable: true },height: { configurable: true } };

Canvas$1.prototype.getContext = function getContext () {
	return this.ctx;
};

Canvas$1.prototype.toDataURL = function toDataURL ( type, encoderOptions, cb ) {
	if ( typeof cb === 'function' ) {
		cb( this.canvasEl.toDataURL( type, encoderOptions ) );
	} else {
		return this.canvasEl.toDataURL( type, encoderOptions );
	}
};
	
prototypeAccessors.width.get = function () {
	return this.canvasEl.width;
};
	
prototypeAccessors.width.set = function ( newWidth ) {
	this.canvasEl.width = newWidth;
};

prototypeAccessors.height.get = function () {
	return this.canvasEl.height;
};

prototypeAccessors.height.set = function ( newHeight ) {
	this.canvasEl.height = newHeight;
};

Object.defineProperties( Canvas$1.prototype, prototypeAccessors );

Canvas$1.Image = Image;

// import Canvas from 'canvas';
// import Canvas from './browser.js';

function imageToImageData ( image ) {
	if ( image instanceof HTMLImageElement ) {
		// http://stackoverflow.com/a/3016076/229189
		if ( ! image.naturalWidth || ! image.naturalHeight || image.complete === false ) {
			throw new Error( "This this image hasn't finished loading: " + image.src );
		}

		var canvas = new Canvas$1( image.naturalWidth, image.naturalHeight );
		var ctx = canvas.getContext( '2d' );
		
		ctx.drawImage( image, 0, 0, canvas.width, canvas.height );

		var imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );

		if ( imageData.data && imageData.data.length ) {
			if ( typeof imageData.width === 'undefined' ) {
				imageData.width = image.naturalWidth;
			}

			if ( typeof imageData.height === 'undefined' ) {
				imageData.height = image.naturalHeight;
			}
		}
		
		return imageData;
	} else {
		throw new Error( 'This object does not seem to be an image.' );
		return;
	}
}

var Image$2 = Canvas$1.Image;

function loadBase64Image ( base64URL ) {
	return new Promise( function ( resolve, reject ) {
		var image = new Image$2();
		
		image.onload = function () {
			resolve( image );
		};

		image.onerror = function (err) {
			reject( err );
		};
		
		image.src = base64URL;
	} );
}

function base64URLToImage ( base64URL, opts, resolve, reject ) {
	loadBase64Image( base64URL )
		.then( resolve, reject );
}

function getImageSize ( image ) {
	return {
		width: image.width || image.naturalWidth,
		height: image.height || image.naturalHeight
	};
}

function canvasFromImage ( image ) {
	var size = getImageSize( image );
	var canvas = new Canvas$1( size.width, size.height );
	var ctx = canvas.getContext( '2d' );
	
	ctx.drawImage( image, 0, 0, size.width, size.height );
		
	return {
		canvas: canvas,
		ctx: ctx
	};
}

function base64URLToImageData ( base64URL, options, resolve, reject ) {
	loadBase64Image( base64URL )
		.then( function (image) {
			var size = getImageSize( image );
			var imageData = canvasFromImage( image )
				.ctx
				.getImageData( 0, 0, size.width, size.height );
			
			if ( ! imageData.width ) {
				imageData.width = size.width;
			}

			if ( ! imageData.height ) {
				imageData.height = size.height;
			}

			resolve( imageData );
		}, reject );
}

function isImageData ( imageData ) {
	return (
		imageData && 
		typeof imageData.width === 'number' &&
		typeof imageData.height === 'number' &&
		imageData.data &&
		typeof imageData.data.length === 'number' &&
		typeof imageData.data === 'object'
	);
}

function imageDataToBase64 ( imageData, quality ) {
	return new Promise ( function ( resolve, reject ) {
		if ( isImageData( imageData ) ) {
			var canvas = new Canvas$1( imageData.width, imageData.height );
			var ctx = canvas.getContext( '2d' );
			ctx.putImageData( imageData, 0, 0 );

			var base64URL = canvas.toDataURL( 'image/jpeg', quality / 100 );

			resolve( base64URL );
		} else {
			reject( new Error( 'object is not valid imageData' ) );
		}
	} );
}

var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var base64Map = base64Chars.split( '' );
base64Map.forEach( function ( val, key ) {  } );

// http://stackoverflow.com/a/10424014/229189

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign$1 = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

// import objectAssign from 'object-assign'

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
}



function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var es6Promise = createCommonjsModule(function (module, exports) {
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.0
 */

(function (global, factory) {
    module.exports = factory();
}(commonjsGlobal, (function () { function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = commonjsRequire;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof commonjsRequire === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator.prototype._enumerate = function () {
  var this$1 = this;

  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this$1._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof commonjsGlobal !== 'undefined') {
        local = commonjsGlobal;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));

});

es6Promise.polyfill();
	

// constructing an object that allows for a chained interface.
// for example stuff like:
// 
// glitch( params )
//     .toImage( img )
//     .toImageData()
// 
// etc...

function glitch ( params ) {
	params = sanitizeInput( params );

	var inputFn;
	var outputFn;

	var worker = new Worker( URL.createObjectURL(new Blob(["function isImageData ( imageData ) {\n\treturn (\n\t\timageData && \n\t\ttypeof imageData.width === 'number' &&\n\t\ttypeof imageData.height === 'number' &&\n\t\timageData.data &&\n\t\ttypeof imageData.data.length === 'number' &&\n\t\ttypeof imageData.data === 'object'\n\t);\n}\n\nvar base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';\nvar base64Map = base64Chars.split( '' );\nvar reversedBase64Map$1 = { };\n\nbase64Map.forEach( function ( val, key ) { reversedBase64Map$1[val] = key; } );\n\nvar maps = {\n\tbase64Map: base64Map,\n\treversedBase64Map: reversedBase64Map$1\n};\n\nvar reversedBase64Map = maps.reversedBase64Map;\n\n// https://github.com/mutaphysis/smackmyglitchupjs/blob/master/glitch.html\n// base64 is 2^6, byte is 2^8, every 4 base64 values create three bytes\nfunction base64ToByteArray ( base64URL ) {\t\n\tvar result = [ ];\n\tvar prev;\n\n\tfor ( var i = 23, len = base64URL.length; i < len; i++ ) {\n\t\tvar currrentChar = reversedBase64Map[ base64URL.charAt( i ) ];\n\t\tvar digitNum = ( i - 23 ) % 4;\n\n\t\tswitch ( digitNum ) {\n\t\t\t// case 0: first digit - do nothing, not enough info to work with\n\t\t\tcase 1: // second digit\n\t\t\t\tresult.push( prev << 2 | currrentChar >> 4 );\n\t\t\t\tbreak;\n\t\t\t\n\t\t\tcase 2: // third digit\n\t\t\t\tresult.push( ( prev & 0x0f ) << 4 | currrentChar >> 2 );\n\t\t\t\tbreak;\n\t\t\t\n\t\t\tcase 3: // fourth digit\n\t\t\t\tresult.push( ( prev & 3 ) << 6 | currrentChar );\n\t\t\t\tbreak;\n\t\t}\n\n\t\tprev = currrentChar;\n\t}\n\n\treturn result;\n}\n\n// http://stackoverflow.com/a/10424014/229189\n\nfunction jpgHeaderLength ( byteArr ) {\n\tvar result = 417;\n\n\tfor ( var i = 0, len = byteArr.length; i < len; i++ ) {\n\t\tif ( byteArr[i] === 0xFF && byteArr[i + 1] === 0xDA ) {\n\t\t\tresult = i + 2;\n\t\t\tbreak;\n\t\t}\n\t}\n\n\treturn result;\n}\n\nfunction glitchByteArray ( byteArray, seed, amount, iterationCount ) {\n\tvar headerLength = jpgHeaderLength( byteArray );\n\tvar maxIndex = byteArray.length - headerLength - 4;\n\n\tvar amountPercent = amount / 100;\n\tvar seedPercent   = seed / 100;\n\n\tfor ( var iterationIndex = 0; iterationIndex < iterationCount; iterationIndex++ ) {\n\t\tvar minPixelIndex = ( maxIndex / iterationCount * iterationIndex ) | 0;\n\t\tvar maxPixelIndex = ( maxIndex / iterationCount * ( iterationIndex + 1 ) ) | 0;\n\t\t\n\t\tvar delta = maxPixelIndex - minPixelIndex;\n\t\tvar pixelIndex = ( minPixelIndex + delta * seedPercent ) | 0;\n\n\t\tif ( pixelIndex > maxIndex ) {\n\t\t\tpixelIndex = maxIndex;\n\t\t}\n\n\t\tvar indexInByteArray = ~~( headerLength + pixelIndex );\n\n\t\tbyteArray[indexInByteArray] = ~~( amountPercent * 256 );\n\t}\n\n\treturn byteArray;\n}\n\nvar base64Map$1 = maps.base64Map;\n\nfunction byteArrayToBase64 ( byteArray ) {\n\tvar result = [ 'data:image/jpeg;base64,' ];\n\tvar byteNum;\n\tvar previousByte;\n\n\tfor ( var i = 0, len = byteArray.length; i < len; i++ ) {\n\t\tvar currentByte = byteArray[i];\n\t\tbyteNum = i % 3;\n\n\t\tswitch ( byteNum ) {\n\t\t\tcase 0: // first byte\n\t\t\t\tresult.push( base64Map$1[ currentByte >> 2 ] );\n\t\t\t\tbreak;\n\t\t\tcase 1: // second byte\n\t\t\t\tresult.push( base64Map$1[( previousByte & 3 ) << 4 | ( currentByte >> 4 )] );\n\t\t\t\tbreak;\n\t\t\tcase 2: // third byte\n\t\t\t\tresult.push( base64Map$1[( previousByte & 0x0f ) << 2 | ( currentByte >> 6 )] );\n\t\t\t\tresult.push( base64Map$1[currentByte & 0x3f] );\n\t\t\t\tbreak;\n\t\t}\n\n\t\tpreviousByte = currentByte;\n\t}\n\n\tif ( byteNum === 0 ) {\n\t\tresult.push( base64Map$1[( previousByte & 3 ) << 4] );\n\t\tresult.push( '==' );\n\t} else {\n\t\tif ( byteNum === 1 ) {\n\t\t\tresult.push( base64Map$1[( previousByte & 0x0f ) << 2] );\n\t\t\tresult.push( '=' );\n\t\t}\n\t}\n\n\treturn result.join( '' );\n}\n\nfunction glitchImageData ( imageData, base64URL, params ) {\n\tif ( isImageData( imageData ) ) {\n\t\tvar byteArray = base64ToByteArray( base64URL );\n\t\tvar glitchedByteArray = glitchByteArray( byteArray, params.seed, params.amount, params.iterations );\n\t\tvar glitchedBase64URL = byteArrayToBase64( glitchedByteArray );\n\t\treturn glitchedBase64URL;\n\t} else {\n\t\tthrow new Error( 'glitchImageData: imageData seems to be corrupt.' );\n\t\treturn;\n\t}\n}\n\nonmessage = function (msg) {\n\tvar imageData = msg.data.imageData;\n\tvar params = msg.data.params;\n\tvar base64URL = msg.data.base64URL;\n\n\tif ( imageData && base64URL && params ) {\n\t\ttry {\n\t\t\t// phantomjs seems to have some memory loss so we need to make sure\n\t\t\tif ( typeof imageData.width === 'undefined' && typeof msg.data.imageDataWidth === 'number' ) {\n\t\t\t\timageData.width = msg.data.imageDataWidth;\n\t\t\t}\n\n\t\t\tif ( typeof imageData.height === 'undefined' && typeof msg.data.imageDataHeight === 'number' ) {\n\t\t\t\timageData.height = msg.data.imageDataHeight;\n\t\t\t}\n\n\t\t\tvar glitchedBase64URL = glitchImageData( imageData, base64URL, params );\n\t\t\tsuccess( glitchedBase64URL );\n\n\t\t} catch ( err ) {\n\t\t\tfail( err );\n\t\t}\n\n\t} else {\n\t\tif ( msg.data.imageData ) {\n\t\t\tfail( 'Parameters are missing.' );\n\t\t} else {\n\t\t\tfail( 'ImageData is missing.' );\n\t\t}\n\t}\n\t\n\tself.close();\n};\n\nfunction fail ( err ) {\n\tself.postMessage( { err: err.message || err } );\n}\n\nfunction success ( base64URL ) {\n\tself.postMessage( { base64URL: base64URL } );\n}\n"],{type:'text/javascript'})) );
	
	var api = { getParams: getParams, getInput: getInput, getOutput: getOutput };
	var inputMethods = { fromImageData: fromImageData, fromImage: fromImage };
	var outputMethods = { toImage: toImage, toDataURL: toDataURL, toImageData: toImageData };

	function getParams () {
		return params;
	}

	function getInput () {
		var result = objectAssign$1( { }, api );

		if ( ! inputFn ) {
			objectAssign$1( result, inputMethods );
		}

		return result;
	}

	function getOutput () {
		var result = objectAssign$1( { }, api );

		if ( ! outputFn ) {
			objectAssign$1( result, outputMethods );
		}

		return result;
	}

	function noTransform ( x ) { return x; }

	function fromImage ( inputOptions ) { return setInput( imageToImageData, inputOptions ); }
	function fromImageData ( inputOptions ) { return setInput( noTransform, inputOptions ); }

	function toDataURL ( outputOptions ) { return setOutput( noTransform ); }
	function toImage ( outputOptions ) { return setOutput( base64URLToImage, outputOptions, true ); }
	function toImageData ( outputOptions ) { return setOutput( base64URLToImageData, outputOptions, true ); }

	function setInput ( fn, inputOptions, canResolve ) {		
		inputFn = function () {
			return new Promise( function ( resolve, reject ) {
				if ( canResolve ) {
					fn( inputOptions, resolve, reject );
				} else {
					if ( fn === noTransform ) {
						resolve( inputOptions );
					} else {
						try {
							resolve( fn( inputOptions, resolve, reject ) );
						} catch ( err ) {
							reject( err );
						}
					}
				}
			} );
		};

		if ( isReady() ) {
			return getResult();
		} else {
			return getOutput();
		}
	}

	function setOutput ( fn, outputOptions, canResolve ) {
		outputFn = function (base64URL) {
			return new Promise( function ( resolve, reject ) {
				if ( canResolve ) {
					fn( base64URL, outputOptions, resolve, reject );
				} else {
					if ( fn === noTransform ) {
						resolve( base64URL );
					} else {
						fn( base64URL, outputOptions )
							.then( resolve, reject );
					}
				}
			} );
		};

		if ( isReady() ) {
			return getResult();
		} else {
			return getInput();
		}
	}

	function isReady () {
		return inputFn && outputFn;
	}

	function getResult () {
		return new Promise( function ( resolve, reject ) {
			inputFn()
				.then( function (imageData) {
					return glitch( imageData, params );
				}, reject )
				.then( function (base64URL) {
					outputFn( base64URL )
						.then( resolve, reject );
				}, reject );
		} );
	}

	function glitch ( imageData, params ) {
		return new Promise( function ( resolve, reject ) {
			imageDataToBase64( imageData, params.quality )
				.then( function (base64URL) {
					return glitchInWorker( imageData, base64URL, params );
				}, reject )
				.then( resolve, reject );
		} );
	}

	function glitchInWorker ( imageData, base64URL, params ) {
		return new Promise( function ( resolve, reject ) {
			worker.addEventListener( 'message', function (event) {
				if ( event.data && event.data.base64URL ) {
					resolve( event.data.base64URL );
				} else {
					if ( event.data && event.data.err ) {
						reject( event.data.err );
					} else {
						reject( event );
					}
				}
			} );

			worker.postMessage( {
				params: params,
				base64URL: base64URL,
				imageData: imageData,

				// phantomjs tends to forget about those two
				// so we send them separately
				imageDataWidth: imageData.width,
				imageDataHeight: imageData.height
			} );
		} );
	}

	return getInput();
}

return glitch;

})));
