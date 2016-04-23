(function(f) {
    if (typeof exports === 'object' && typeof module !== 'undefined') {
        module.exports = f();
    } else {
        if (typeof define === 'function' && define.amd) {
            define([], f);
        } else {
            var g;
            if (typeof window !== 'undefined') {
                g = window;
            } else {
                if (typeof global !== 'undefined') {
                    g = global;
                } else {
                    if (typeof self !== 'undefined') {
                        g = self;
                    } else {
                        g = this;
                    }
                }
            }
            g.glitch = f();
        }
    }
})(function() {
    var define, module, exports;
    return function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == 'function' && require;
                    if (!u && a) {
                        return a(o, !0);
                    }
                    if (i) {
                        return i(o, !0);
                    }
                    var f = new Error('Cannot find module \'' + o + '\'');
                    throw f.code = 'MODULE_NOT_FOUND', f;
                }
                var l = n[o] = {
                    exports: {}
                };
                t[o][0].call(l.exports, function(e) {
                    var n = t[o][1][e];
                    return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }
            return n[o].exports;
        }
        var i = typeof require == 'function' && require;
        for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }
        return s;
    }({
        1: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _es6Promise = _dereq_('es6-promise'), _browser = _dereq_('./browser'), _browser2 = _interopRequireDefault(_browser);
            (0, _es6Promise.polyfill)(), exports['default'] = _browser2['default'], module.exports = exports['default'];
        }, {
            './browser': 2,
            'es6-promise': 23
        } ],
        2: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _extends = Object.assign || function(target) {
                for (var i = 1; i < arguments.length; i++) {
                    var source = arguments[i];
                    for (var key in source) {
                        Object.prototype.hasOwnProperty.call(source, key) && (target[key] = source[key]);
                    }
                }
                return target;
            };
            exports['default'] = function(params) {
                function getParams() {
                    return params;
                }
                function getInput() {
                    var result = _extends({}, api);
                    return inputFn || _extends(result, inputMethods), result;
                }
                function getOutput() {
                    var result = _extends({}, api);
                    return outputFn || _extends(result, outputMethods), result;
                }
                function noTransform(x) {
                    return x;
                }
                function fromImage(inputOptions) {
                    return setInput(_fromImage2['default'], inputOptions);
                }
                function fromImageData(inputOptions) {
                    return setInput(noTransform, inputOptions);
                }
                function toDataURL(outputOptions) {
                    return setOutput(noTransform);
                }
                function toImage(outputOptions) {
                    return setOutput(_toImage2['default'], outputOptions, !0);
                }
                function toImageData(outputOptions) {
                    return setOutput(_toImageData2['default'], outputOptions, !0);
                }
                function setInput(fn, inputOptions, canResolve) {
                    return inputFn = function() {
                        return new Promise(function(resolve, reject) {
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
                    }, isReady() ? getResult() : getOutput();
                }
                function setOutput(fn, outputOptions, canResolve) {
                    return outputFn = function(base64URL) {
                        return new Promise(function(resolve, reject) {
                            canResolve ? fn(base64URL, outputOptions, resolve, reject) : fn === noTransform ? resolve(base64URL) : fn(base64URL, outputOptions).then(resolve, reject);
                        });
                    }, isReady() ? getResult() : getInput();
                }
                function isReady() {
                    return inputFn && outputFn;
                }
                function getResult() {
                    return new Promise(function(resolve, reject) {
                        inputFn().then(function(imageData) {
                            return glitch(imageData, params);
                        }, reject).then(function(base64URL) {
                            outputFn(base64URL).then(resolve, reject);
                        }, reject);
                    });
                }
                function glitch(imageData, params) {
                    return new Promise(function(resolve, reject) {
                        (0, _imageDataToBase2['default'])(imageData, params.quality).then(function(base64URL) {
                            return glitchInWorker(imageData, base64URL, params);
                        }, reject).then(resolve, reject);
                    });
                }
                function glitchInWorker(imageData, base64URL, params) {
                    return new Promise(function(resolve, reject) {
                        worker.addEventListener('message', function(event) {
                            event.data && event.data.base64URL ? resolve(event.data.base64URL) : reject(event.data && event.data.err ? event.data.err : event);
                        }), worker.postMessage({
                            params: params,
                            base64URL: base64URL,
                            imageData: imageData,
                            imageDataWidth: imageData.width,
                            imageDataHeight: imageData.height
                        });
                    });
                }
                params = (0, _sanitizeInput2['default'])(params);
                var inputFn = void 0, outputFn = void 0, worker = (0, _webworkify2['default'])(_glitchWorker2['default']), api = {
                    getParams: getParams,
                    getInput: getInput,
                    getOutput: getOutput
                }, inputMethods = {
                    fromImageData: fromImageData,
                    fromImage: fromImage
                }, outputMethods = {
                    toImage: toImage,
                    toDataURL: toDataURL,
                    toImageData: toImageData
                };
                return getInput();
            };
            var _sanitizeInput = _dereq_('./input/sanitizeInput'), _sanitizeInput2 = _interopRequireDefault(_sanitizeInput), _fromImage = _dereq_('./input/browser/fromImage'), _fromImage2 = _interopRequireDefault(_fromImage), _toImage = _dereq_('./output/browser/toImage'), _toImage2 = _interopRequireDefault(_toImage), _toImageData = _dereq_('./output/toImageData'), _toImageData2 = _interopRequireDefault(_toImageData), _imageDataToBase = _dereq_('./glitch/browser/imageDataToBase64'), _imageDataToBase2 = _interopRequireDefault(_imageDataToBase), _glitchImageData = _dereq_('./glitch/glitchImageData'), _glitchImageData2 = _interopRequireDefault(_glitchImageData), _webworkify = _dereq_('webworkify'), _webworkify2 = _interopRequireDefault(_webworkify), _glitchWorker = _dereq_('./workers/glitchWorker'), _glitchWorker2 = _interopRequireDefault(_glitchWorker);
            module.exports = exports['default'];
        }, {
            './glitch/browser/imageDataToBase64': 5,
            './glitch/glitchImageData': 8,
            './input/browser/fromImage': 10,
            './input/sanitizeInput': 12,
            './output/browser/toImage': 13,
            './output/toImageData': 14,
            './workers/glitchWorker': 21,
            webworkify: 25
        } ],
        3: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/', base64Map = base64Chars.split(''), reversedBase64Map = {};
            base64Map.forEach(function(val, key) {
                reversedBase64Map[val] = key;
            }), exports['default'] = {
                map: base64Map,
                reverse: reversedBase64Map
            }, module.exports = exports['default'];
        }, {} ],
        4: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(base64URL) {
                for (var digitNum, currrentChar, prev, result = [], i = 23, len = base64URL.length; len > i; i++) {
                    switch (currrentChar = _base64Map.reverse[base64URL.charAt(i)], digitNum = (i - 23) % 4) {
                      case 1:
                        result.push(prev << 2 | currrentChar >> 4);
                        break;

                      case 2:
                        result.push((15 & prev) << 4 | currrentChar >> 2);
                        break;

                      case 3:
                        result.push((3 & prev) << 6 | currrentChar);
                    }
                    prev = currrentChar;
                }
                return result;
            };
            var _base64Map = _dereq_('./base64Map');
            module.exports = exports['default'];
        }, {
            './base64Map': 3
        } ],
        5: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(imageData, quality) {
                return new Promise(function(resolve, reject) {
                    if ((0, _isImageData2['default'])(imageData)) {
                        var canvas = new _canvasBrowserify2['default'](imageData.width, imageData.height), ctx = canvas.getContext('2d');
                        ctx.putImageData(imageData, 0, 0);
                        var base64URL = canvas.toDataURL('image/jpeg', quality / 100);
                        resolve(base64URL);
                    } else {
                        reject(new Error('object is not valid imageData'));
                    }
                });
            };
            var _canvasBrowserify = _dereq_('canvas-browserify'), _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify), _isImageData = _dereq_('../../util/isImageData'), _isImageData2 = _interopRequireDefault(_isImageData);
            module.exports = exports['default'];
        }, {
            '../../util/isImageData': 19,
            'canvas-browserify': 22
        } ],
        6: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(byteArray) {
                for (var result = [ 'data:image/jpeg;base64,' ], byteNum = void 0, currentByte = void 0, previousByte = void 0, i = 0, len = byteArray.length; len > i; i++) {
                    switch (currentByte = byteArray[i], byteNum = i % 3) {
                      case 0:
                        result.push(_base64Map.map[currentByte >> 2]);
                        break;

                      case 1:
                        result.push(_base64Map.map[(3 & previousByte) << 4 | currentByte >> 4]);
                        break;

                      case 2:
                        result.push(_base64Map.map[(15 & previousByte) << 2 | currentByte >> 6]), result.push(_base64Map.map[63 & currentByte]);
                    }
                    previousByte = currentByte;
                }
                return 0 === byteNum ? (result.push(_base64Map.map[(3 & previousByte) << 4]), result.push('==')) : 1 === byteNum && (result.push(_base64Map.map[(15 & previousByte) << 2]), 
                result.push('=')), result.join('');
            };
            var _base64Map = _dereq_('./base64Map');
            module.exports = exports['default'];
        }, {
            './base64Map': 3
        } ],
        7: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(byteArray, seed, amount, iterationCount) {
                for (var headerLength = (0, _jpgHeaderLength2['default'])(byteArray), maxIndex = byteArray.length - headerLength - 4, amountPercent = amount / 100, seedPercent = seed / 100, iterationIndex = 0; iterationCount > iterationIndex; iterationIndex++) {
                    var minPixelIndex = maxIndex / iterationCount * iterationIndex | 0, maxPixelIndex = maxIndex / iterationCount * (iterationIndex + 1) | 0, delta = maxPixelIndex - minPixelIndex, pixelIndex = minPixelIndex + delta * seedPercent | 0;
                    pixelIndex > maxIndex && (pixelIndex = maxIndex);
                    var indexInByteArray = ~~(headerLength + pixelIndex);
                    byteArray[indexInByteArray] = ~~(256 * amountPercent);
                }
                return byteArray;
            };
            var _jpgHeaderLength = _dereq_('./jpgHeaderLength'), _jpgHeaderLength2 = _interopRequireDefault(_jpgHeaderLength);
            module.exports = exports['default'];
        }, {
            './jpgHeaderLength': 9
        } ],
        8: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(imageData, base64URL, params) {
                if ((0, _isImageData2['default'])(imageData)) {
                    var byteArray = (0, _base64ToByteArray2['default'])(base64URL), glitchedByteArray = (0, 
                    _glitchByteArray2['default'])(byteArray, params.seed, params.amount, params.iterations), glitchedBase64URL = (0, 
                    _byteArrayToBase2['default'])(glitchedByteArray);
                    return glitchedBase64URL;
                }
                throw new Error('glitchImageData: imageData seems to be corrupt.');
            };
            var _isImageData = _dereq_('../util/isImageData'), _isImageData2 = _interopRequireDefault(_isImageData), _base64ToByteArray = _dereq_('./base64ToByteArray'), _base64ToByteArray2 = _interopRequireDefault(_base64ToByteArray), _glitchByteArray = _dereq_('./glitchByteArray'), _glitchByteArray2 = _interopRequireDefault(_glitchByteArray), _byteArrayToBase = _dereq_('./byteArrayToBase64'), _byteArrayToBase2 = _interopRequireDefault(_byteArrayToBase);
            module.exports = exports['default'];
        }, {
            '../util/isImageData': 19,
            './base64ToByteArray': 4,
            './byteArrayToBase64': 6,
            './glitchByteArray': 7
        } ],
        9: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(byteArr) {
                for (var result = 417, i = 0, len = byteArr.length; len > i; i++) {
                    if (255 === byteArr[i] && 218 === byteArr[i + 1]) {
                        result = i + 2;
                        break;
                    }
                }
                return result;
            }, module.exports = exports['default'];
        }, {} ],
        10: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(image) {
                if (image instanceof HTMLImageElement) {
                    if (!image.naturalWidth || !image.naturalHeight || image.complete === !1) {
                        throw new Error('This this image hasn\'t finished loading: ' + image.src);
                    }
                    var canvas = new _canvasBrowserify2['default'](image.naturalWidth, image.naturalHeight), ctx = canvas.getContext('2d');
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    return imageData.data && imageData.data.length && ('undefined' == typeof imageData.width && (imageData.width = image.naturalWidth), 
                    'undefined' == typeof imageData.height && (imageData.height = image.naturalHeight)), 
                    imageData;
                }
                throw new Error('This object does not seem to be an image.');
            };
            var _canvasBrowserify = _dereq_('canvas-browserify'), _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify), Image = _canvasBrowserify2['default'].Image;
            module.exports = exports['default'];
        }, {
            'canvas-browserify': 22
        } ],
        11: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = {
                amount: 35,
                iterations: 20,
                quality: 30,
                seed: 25
            }, module.exports = exports['default'];
        }, {} ],
        12: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _typeof = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && 'function' == typeof Symbol && obj.constructor === Symbol ? 'symbol' : typeof obj;
            };
            exports['default'] = function(params) {
                params = (0, _clone2['default'])(params), 'object' !== ('undefined' == typeof params ? 'undefined' : _typeof(params)) && (params = {});
                var defaultKeys = Object.keys(_defaultParams2['default']).filter(function(key) {
                    return 'iterations' !== key;
                });
                return defaultKeys.forEach(function(key) {
                    'number' != typeof params[key] || isNaN(params[key]) ? params[key] = _defaultParams2['default'][key] : params[key] = (0, 
                    _clamp2['default'])(params[key], 0, 100), params[key] = Math.round(params[key]);
                }), ('number' != typeof params.iterations || isNaN(params.iterations) || params.iterations <= 0) && (params.iterations = _defaultParams2['default'].iterations), 
                params.iterations = Math.round(params.iterations), params;
            };
            var _clamp = _dereq_('../util/clamp'), _clamp2 = _interopRequireDefault(_clamp), _clone = _dereq_('../util/clone'), _clone2 = _interopRequireDefault(_clone), _defaultParams = _dereq_('./defaultParams'), _defaultParams2 = _interopRequireDefault(_defaultParams);
            module.exports = exports['default'];
        }, {
            '../util/clamp': 16,
            '../util/clone': 17,
            './defaultParams': 11
        } ],
        13: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(base64URL, opts, resolve, reject) {
                (0, _loadBase64Image2['default'])(base64URL).then(resolve, reject);
            };
            var _loadBase64Image = _dereq_('../../util/loadBase64Image'), _loadBase64Image2 = _interopRequireDefault(_loadBase64Image);
            module.exports = exports['default'];
        }, {
            '../../util/loadBase64Image': 20
        } ],
        14: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(base64URL, options, resolve, reject) {
                (0, _loadBase64Image2['default'])(base64URL).then(function(image) {
                    var size = (0, _getImageSize2['default'])(image), imageData = (0, _canvasFromImage2['default'])(image).ctx.getImageData(0, 0, size.width, size.height);
                    imageData.width || (imageData.width = size.width), imageData.height || (imageData.height = size.height), 
                    resolve(imageData);
                }, reject);
            };
            var _loadBase64Image = _dereq_('../util/loadBase64Image'), _loadBase64Image2 = _interopRequireDefault(_loadBase64Image), _canvasFromImage = _dereq_('../util/canvasFromImage'), _canvasFromImage2 = _interopRequireDefault(_canvasFromImage), _getImageSize = _dereq_('../util/getImageSize'), _getImageSize2 = _interopRequireDefault(_getImageSize);
            module.exports = exports['default'];
        }, {
            '../util/canvasFromImage': 15,
            '../util/getImageSize': 18,
            '../util/loadBase64Image': 20
        } ],
        15: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(image) {
                var size = (0, _getImageSize2['default'])(image), canvas = new _canvasBrowserify2['default'](size.width, size.height), ctx = canvas.getContext('2d');
                return ctx.drawImage(image, 0, 0, size.width, size.height), {
                    canvas: canvas,
                    ctx: ctx
                };
            };
            var _canvasBrowserify = _dereq_('canvas-browserify'), _canvasBrowserify2 = _interopRequireDefault(_canvasBrowserify), _getImageSize = _dereq_('./getImageSize'), _getImageSize2 = _interopRequireDefault(_getImageSize);
            module.exports = exports['default'];
        }, {
            './getImageSize': 18,
            'canvas-browserify': 22
        } ],
        16: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(value, min, max) {
                return min > value ? min : value > max ? max : value;
            }, module.exports = exports['default'];
        }, {} ],
        17: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(obj) {
                var result = !1;
                if ('undefined' != typeof obj) {
                    try {
                        result = JSON.parse(JSON.stringify(obj));
                    } catch (e) {}
                }
                return result;
            }, module.exports = exports['default'];
        }, {} ],
        18: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(image) {
                return {
                    width: image.width || image.naturalWidth,
                    height: image.height || image.naturalHeight
                };
            }, module.exports = exports['default'];
        }, {} ],
        19: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            });
            var _typeof = 'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator ? function(obj) {
                return typeof obj;
            } : function(obj) {
                return obj && 'function' == typeof Symbol && obj.constructor === Symbol ? 'symbol' : typeof obj;
            };
            exports['default'] = function(imageData) {
                return imageData && 'number' == typeof imageData.width && 'number' == typeof imageData.height && imageData.data && 'number' == typeof imageData.data.length && 'object' === _typeof(imageData.data);
            }, module.exports = exports['default'];
        }, {} ],
        20: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(base64URL) {
                return new Promise(function(resolve, reject) {
                    var image = new _canvasBrowserify.Image();
                    image.onload = function() {
                        resolve(image);
                    }, image.onerror = function(err) {
                        reject(err);
                    }, image.src = base64URL;
                });
            };
            var _canvasBrowserify = _dereq_('canvas-browserify');
            module.exports = exports['default'];
        }, {
            'canvas-browserify': 22
        } ],
        21: [ function(_dereq_, module, exports) {
            'use strict';
            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : {
                    'default': obj
                };
            }
            function worker(self) {
                self.addEventListener('message', function(msg) {
                    var imageData = msg.data.imageData, params = msg.data.params, base64URL = msg.data.base64URL;
                    if (imageData && base64URL && params) {
                        try {
                            'undefined' == typeof imageData.width && 'number' == typeof msg.data.imageDataWidth && (imageData.width = msg.data.imageDataWidth), 
                            'undefined' == typeof imageData.height && 'number' == typeof msg.data.imageDataHeight && (imageData.height = msg.data.imageDataHeight);
                            var glitchedBase64URL = (0, _glitchImageData2['default'])(imageData, base64URL, params);
                            success(glitchedBase64URL);
                        } catch (err) {
                            fail(err);
                        }
                    } else {
                        fail(msg.data.imageData ? 'Parameters are missing.' : 'ImageData is missing.');
                    }
                    self.close();
                });
            }
            function fail(err) {
                self.postMessage({
                    err: err.message || err
                });
            }
            function success(base64URL) {
                self.postMessage({
                    base64URL: base64URL
                });
            }
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = worker;
            var _glitchImageData = _dereq_('../glitch/glitchImageData'), _glitchImageData2 = _interopRequireDefault(_glitchImageData);
            module.exports = exports['default'];
        }, {
            '../glitch/glitchImageData': 8
        } ],
        22: [ function(_dereq_, module, exports) {
            var Canvas = module.exports = function Canvas(w, h) {
                var canvas = document.createElement('canvas');
                canvas.width = w || 300;
                canvas.height = h || 150;
                return canvas;
            };
            Canvas.Image = function() {
                var img = document.createElement('img');
                return img;
            };
        }, {} ],
        23: [ function(_dereq_, module, exports) {
            (function(process, global) {
                (function() {
                    'use strict';
                    function lib$es6$promise$utils$$objectOrFunction(x) {
                        return typeof x === 'function' || typeof x === 'object' && x !== null;
                    }
                    function lib$es6$promise$utils$$isFunction(x) {
                        return typeof x === 'function';
                    }
                    function lib$es6$promise$utils$$isMaybeThenable(x) {
                        return typeof x === 'object' && x !== null;
                    }
                    var lib$es6$promise$utils$$_isArray;
                    if (!Array.isArray) {
                        lib$es6$promise$utils$$_isArray = function(x) {
                            return Object.prototype.toString.call(x) === '[object Array]';
                        };
                    } else {
                        lib$es6$promise$utils$$_isArray = Array.isArray;
                    }
                    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
                    var lib$es6$promise$asap$$len = 0;
                    var lib$es6$promise$asap$$toString = {}.toString;
                    var lib$es6$promise$asap$$vertxNext;
                    var lib$es6$promise$asap$$customSchedulerFn;
                    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
                        lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
                        lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
                        lib$es6$promise$asap$$len += 2;
                        if (lib$es6$promise$asap$$len === 2) {
                            if (lib$es6$promise$asap$$customSchedulerFn) {
                                lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
                            } else {
                                lib$es6$promise$asap$$scheduleFlush();
                            }
                        }
                    };
                    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
                        lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
                    }
                    function lib$es6$promise$asap$$setAsap(asapFn) {
                        lib$es6$promise$asap$$asap = asapFn;
                    }
                    var lib$es6$promise$asap$$browserWindow = typeof window !== 'undefined' ? window : undefined;
                    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
                    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
                    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
                    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';
                    function lib$es6$promise$asap$$useNextTick() {
                        return function() {
                            process.nextTick(lib$es6$promise$asap$$flush);
                        };
                    }
                    function lib$es6$promise$asap$$useVertxTimer() {
                        return function() {
                            lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
                        };
                    }
                    function lib$es6$promise$asap$$useMutationObserver() {
                        var iterations = 0;
                        var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
                        var node = document.createTextNode('');
                        observer.observe(node, {
                            characterData: true
                        });
                        return function() {
                            node.data = iterations = ++iterations % 2;
                        };
                    }
                    function lib$es6$promise$asap$$useMessageChannel() {
                        var channel = new MessageChannel();
                        channel.port1.onmessage = lib$es6$promise$asap$$flush;
                        return function() {
                            channel.port2.postMessage(0);
                        };
                    }
                    function lib$es6$promise$asap$$useSetTimeout() {
                        return function() {
                            setTimeout(lib$es6$promise$asap$$flush, 1);
                        };
                    }
                    var lib$es6$promise$asap$$queue = new Array(1e3);
                    function lib$es6$promise$asap$$flush() {
                        for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) {
                            var callback = lib$es6$promise$asap$$queue[i];
                            var arg = lib$es6$promise$asap$$queue[i + 1];
                            callback(arg);
                            lib$es6$promise$asap$$queue[i] = undefined;
                            lib$es6$promise$asap$$queue[i + 1] = undefined;
                        }
                        lib$es6$promise$asap$$len = 0;
                    }
                    function lib$es6$promise$asap$$attemptVertx() {
                        try {
                            var r = _dereq_;
                            var vertx = r('vertx');
                            lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
                            return lib$es6$promise$asap$$useVertxTimer();
                        } catch (e) {
                            return lib$es6$promise$asap$$useSetTimeout();
                        }
                    }
                    var lib$es6$promise$asap$$scheduleFlush;
                    if (lib$es6$promise$asap$$isNode) {
                        lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
                    } else {
                        if (lib$es6$promise$asap$$BrowserMutationObserver) {
                            lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
                        } else {
                            if (lib$es6$promise$asap$$isWorker) {
                                lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
                            } else {
                                if (lib$es6$promise$asap$$browserWindow === undefined && typeof _dereq_ === 'function') {
                                    lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
                                } else {
                                    lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
                                }
                            }
                        }
                    }
                    function lib$es6$promise$$internal$$noop() {}
                    var lib$es6$promise$$internal$$PENDING = void 0;
                    var lib$es6$promise$$internal$$FULFILLED = 1;
                    var lib$es6$promise$$internal$$REJECTED = 2;
                    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();
                    function lib$es6$promise$$internal$$selfFulfillment() {
                        return new TypeError('You cannot resolve a promise with itself');
                    }
                    function lib$es6$promise$$internal$$cannotReturnOwn() {
                        return new TypeError('A promises callback cannot return that same promise.');
                    }
                    function lib$es6$promise$$internal$$getThen(promise) {
                        try {
                            return promise.then;
                        } catch (error) {
                            lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
                            return lib$es6$promise$$internal$$GET_THEN_ERROR;
                        }
                    }
                    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
                        try {
                            then.call(value, fulfillmentHandler, rejectionHandler);
                        } catch (e) {
                            return e;
                        }
                    }
                    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
                        lib$es6$promise$asap$$asap(function(promise) {
                            var sealed = false;
                            var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
                                if (sealed) {
                                    return;
                                }
                                sealed = true;
                                if (thenable !== value) {
                                    lib$es6$promise$$internal$$resolve(promise, value);
                                } else {
                                    lib$es6$promise$$internal$$fulfill(promise, value);
                                }
                            }, function(reason) {
                                if (sealed) {
                                    return;
                                }
                                sealed = true;
                                lib$es6$promise$$internal$$reject(promise, reason);
                            }, 'Settle: ' + (promise._label || ' unknown promise'));
                            if (!sealed && error) {
                                sealed = true;
                                lib$es6$promise$$internal$$reject(promise, error);
                            }
                        }, promise);
                    }
                    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
                        if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
                            lib$es6$promise$$internal$$fulfill(promise, thenable._result);
                        } else {
                            if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
                                lib$es6$promise$$internal$$reject(promise, thenable._result);
                            } else {
                                lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
                                    lib$es6$promise$$internal$$resolve(promise, value);
                                }, function(reason) {
                                    lib$es6$promise$$internal$$reject(promise, reason);
                                });
                            }
                        }
                    }
                    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
                        if (maybeThenable.constructor === promise.constructor) {
                            lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
                        } else {
                            var then = lib$es6$promise$$internal$$getThen(maybeThenable);
                            if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
                                lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
                            } else {
                                if (then === undefined) {
                                    lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
                                } else {
                                    if (lib$es6$promise$utils$$isFunction(then)) {
                                        lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
                                    } else {
                                        lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
                                    }
                                }
                            }
                        }
                    }
                    function lib$es6$promise$$internal$$resolve(promise, value) {
                        if (promise === value) {
                            lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
                        } else {
                            if (lib$es6$promise$utils$$objectOrFunction(value)) {
                                lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
                            } else {
                                lib$es6$promise$$internal$$fulfill(promise, value);
                            }
                        }
                    }
                    function lib$es6$promise$$internal$$publishRejection(promise) {
                        if (promise._onerror) {
                            promise._onerror(promise._result);
                        }
                        lib$es6$promise$$internal$$publish(promise);
                    }
                    function lib$es6$promise$$internal$$fulfill(promise, value) {
                        if (promise._state !== lib$es6$promise$$internal$$PENDING) {
                            return;
                        }
                        promise._result = value;
                        promise._state = lib$es6$promise$$internal$$FULFILLED;
                        if (promise._subscribers.length !== 0) {
                            lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
                        }
                    }
                    function lib$es6$promise$$internal$$reject(promise, reason) {
                        if (promise._state !== lib$es6$promise$$internal$$PENDING) {
                            return;
                        }
                        promise._state = lib$es6$promise$$internal$$REJECTED;
                        promise._result = reason;
                        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
                    }
                    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
                        var subscribers = parent._subscribers;
                        var length = subscribers.length;
                        parent._onerror = null;
                        subscribers[length] = child;
                        subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
                        subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection;
                        if (length === 0 && parent._state) {
                            lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
                        }
                    }
                    function lib$es6$promise$$internal$$publish(promise) {
                        var subscribers = promise._subscribers;
                        var settled = promise._state;
                        if (subscribers.length === 0) {
                            return;
                        }
                        var child, callback, detail = promise._result;
                        for (var i = 0; i < subscribers.length; i += 3) {
                            child = subscribers[i];
                            callback = subscribers[i + settled];
                            if (child) {
                                lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
                            } else {
                                callback(detail);
                            }
                        }
                        promise._subscribers.length = 0;
                    }
                    function lib$es6$promise$$internal$$ErrorObject() {
                        this.error = null;
                    }
                    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();
                    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
                        try {
                            return callback(detail);
                        } catch (e) {
                            lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
                            return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
                        }
                    }
                    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
                        var hasCallback = lib$es6$promise$utils$$isFunction(callback), value, error, succeeded, failed;
                        if (hasCallback) {
                            value = lib$es6$promise$$internal$$tryCatch(callback, detail);
                            if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
                                failed = true;
                                error = value.error;
                                value = null;
                            } else {
                                succeeded = true;
                            }
                            if (promise === value) {
                                lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
                                return;
                            }
                        } else {
                            value = detail;
                            succeeded = true;
                        }
                        if (promise._state !== lib$es6$promise$$internal$$PENDING) {} else {
                            if (hasCallback && succeeded) {
                                lib$es6$promise$$internal$$resolve(promise, value);
                            } else {
                                if (failed) {
                                    lib$es6$promise$$internal$$reject(promise, error);
                                } else {
                                    if (settled === lib$es6$promise$$internal$$FULFILLED) {
                                        lib$es6$promise$$internal$$fulfill(promise, value);
                                    } else {
                                        if (settled === lib$es6$promise$$internal$$REJECTED) {
                                            lib$es6$promise$$internal$$reject(promise, value);
                                        }
                                    }
                                }
                            }
                        }
                    }
                    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
                        try {
                            resolver(function resolvePromise(value) {
                                lib$es6$promise$$internal$$resolve(promise, value);
                            }, function rejectPromise(reason) {
                                lib$es6$promise$$internal$$reject(promise, reason);
                            });
                        } catch (e) {
                            lib$es6$promise$$internal$$reject(promise, e);
                        }
                    }
                    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
                        var enumerator = this;
                        enumerator._instanceConstructor = Constructor;
                        enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);
                        if (enumerator._validateInput(input)) {
                            enumerator._input = input;
                            enumerator.length = input.length;
                            enumerator._remaining = input.length;
                            enumerator._init();
                            if (enumerator.length === 0) {
                                lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
                            } else {
                                enumerator.length = enumerator.length || 0;
                                enumerator._enumerate();
                                if (enumerator._remaining === 0) {
                                    lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
                                }
                            }
                        } else {
                            lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
                        }
                    }
                    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
                        return lib$es6$promise$utils$$isArray(input);
                    };
                    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
                        return new Error('Array Methods must be provided an Array');
                    };
                    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
                        this._result = new Array(this.length);
                    };
                    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
                    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
                        var enumerator = this;
                        var length = enumerator.length;
                        var promise = enumerator.promise;
                        var input = enumerator._input;
                        for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
                            enumerator._eachEntry(input[i], i);
                        }
                    };
                    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
                        var enumerator = this;
                        var c = enumerator._instanceConstructor;
                        if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
                            if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
                                entry._onerror = null;
                                enumerator._settledAt(entry._state, i, entry._result);
                            } else {
                                enumerator._willSettleAt(c.resolve(entry), i);
                            }
                        } else {
                            enumerator._remaining--;
                            enumerator._result[i] = entry;
                        }
                    };
                    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
                        var enumerator = this;
                        var promise = enumerator.promise;
                        if (promise._state === lib$es6$promise$$internal$$PENDING) {
                            enumerator._remaining--;
                            if (state === lib$es6$promise$$internal$$REJECTED) {
                                lib$es6$promise$$internal$$reject(promise, value);
                            } else {
                                enumerator._result[i] = value;
                            }
                        }
                        if (enumerator._remaining === 0) {
                            lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
                        }
                    };
                    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
                        var enumerator = this;
                        lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
                            enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
                        }, function(reason) {
                            enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
                        });
                    };
                    function lib$es6$promise$promise$all$$all(entries) {
                        return new lib$es6$promise$enumerator$$default(this, entries).promise;
                    }
                    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
                    function lib$es6$promise$promise$race$$race(entries) {
                        var Constructor = this;
                        var promise = new Constructor(lib$es6$promise$$internal$$noop);
                        if (!lib$es6$promise$utils$$isArray(entries)) {
                            lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
                            return promise;
                        }
                        var length = entries.length;
                        function onFulfillment(value) {
                            lib$es6$promise$$internal$$resolve(promise, value);
                        }
                        function onRejection(reason) {
                            lib$es6$promise$$internal$$reject(promise, reason);
                        }
                        for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
                            lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
                        }
                        return promise;
                    }
                    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
                    function lib$es6$promise$promise$resolve$$resolve(object) {
                        var Constructor = this;
                        if (object && typeof object === 'object' && object.constructor === Constructor) {
                            return object;
                        }
                        var promise = new Constructor(lib$es6$promise$$internal$$noop);
                        lib$es6$promise$$internal$$resolve(promise, object);
                        return promise;
                    }
                    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
                    function lib$es6$promise$promise$reject$$reject(reason) {
                        var Constructor = this;
                        var promise = new Constructor(lib$es6$promise$$internal$$noop);
                        lib$es6$promise$$internal$$reject(promise, reason);
                        return promise;
                    }
                    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;
                    var lib$es6$promise$promise$$counter = 0;
                    function lib$es6$promise$promise$$needsResolver() {
                        throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
                    }
                    function lib$es6$promise$promise$$needsNew() {
                        throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
                    }
                    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
                    function lib$es6$promise$promise$$Promise(resolver) {
                        this._id = lib$es6$promise$promise$$counter++;
                        this._state = undefined;
                        this._result = undefined;
                        this._subscribers = [];
                        if (lib$es6$promise$$internal$$noop !== resolver) {
                            if (!lib$es6$promise$utils$$isFunction(resolver)) {
                                lib$es6$promise$promise$$needsResolver();
                            }
                            if (!(this instanceof lib$es6$promise$promise$$Promise)) {
                                lib$es6$promise$promise$$needsNew();
                            }
                            lib$es6$promise$$internal$$initializePromise(this, resolver);
                        }
                    }
                    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
                    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
                    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
                    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
                    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
                    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
                    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;
                    lib$es6$promise$promise$$Promise.prototype = {
                        constructor: lib$es6$promise$promise$$Promise,
                        then: function(onFulfillment, onRejection) {
                            var parent = this;
                            var state = parent._state;
                            if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
                                return this;
                            }
                            var child = new this.constructor(lib$es6$promise$$internal$$noop);
                            var result = parent._result;
                            if (state) {
                                var callback = arguments[state - 1];
                                lib$es6$promise$asap$$asap(function() {
                                    lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
                                });
                            } else {
                                lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
                            }
                            return child;
                        },
                        'catch': function(onRejection) {
                            return this.then(null, onRejection);
                        }
                    };
                    function lib$es6$promise$polyfill$$polyfill() {
                        var local;
                        if (typeof global !== 'undefined') {
                            local = global;
                        } else {
                            if (typeof self !== 'undefined') {
                                local = self;
                            } else {
                                try {
                                    local = Function('return this')();
                                } catch (e) {
                                    throw new Error('polyfill failed because global object is unavailable in this environment');
                                }
                            }
                        }
                        var P = local.Promise;
                        if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
                            return;
                        }
                        local.Promise = lib$es6$promise$promise$$default;
                    }
                    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;
                    var lib$es6$promise$umd$$ES6Promise = {
                        Promise: lib$es6$promise$promise$$default,
                        polyfill: lib$es6$promise$polyfill$$default
                    };
                    if (typeof define === 'function' && define['amd']) {
                        define(function() {
                            return lib$es6$promise$umd$$ES6Promise;
                        });
                    } else {
                        if (typeof module !== 'undefined' && module['exports']) {
                            module['exports'] = lib$es6$promise$umd$$ES6Promise;
                        } else {
                            if (typeof this !== 'undefined') {
                                this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
                            }
                        }
                    }
                    lib$es6$promise$polyfill$$default();
                }).call(this);
            }).call(this, _dereq_('_process'), typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : {});
        }, {
            _process: 24
        } ],
        24: [ function(_dereq_, module, exports) {
            var process = module.exports = {};
            var queue = [];
            var draining = false;
            var currentQueue;
            var queueIndex = -1;
            function cleanUpNextTick() {
                draining = false;
                if (currentQueue.length) {
                    queue = currentQueue.concat(queue);
                } else {
                    queueIndex = -1;
                }
                if (queue.length) {
                    drainQueue();
                }
            }
            function drainQueue() {
                if (draining) {
                    return;
                }
                var timeout = setTimeout(cleanUpNextTick);
                draining = true;
                var len = queue.length;
                while (len) {
                    currentQueue = queue;
                    queue = [];
                    while (++queueIndex < len) {
                        if (currentQueue) {
                            currentQueue[queueIndex].run();
                        }
                    }
                    queueIndex = -1;
                    len = queue.length;
                }
                currentQueue = null;
                draining = false;
                clearTimeout(timeout);
            }
            process.nextTick = function(fun) {
                var args = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var i = 1; i < arguments.length; i++) {
                        args[i - 1] = arguments[i];
                    }
                }
                queue.push(new Item(fun, args));
                if (queue.length === 1 && !draining) {
                    setTimeout(drainQueue, 0);
                }
            };
            function Item(fun, array) {
                this.fun = fun;
                this.array = array;
            }
            Item.prototype.run = function() {
                this.fun.apply(null, this.array);
            };
            process.title = 'browser';
            process.browser = true;
            process.env = {};
            process.argv = [];
            process.version = '';
            process.versions = {};
            function noop() {}
            process.on = noop;
            process.addListener = noop;
            process.once = noop;
            process.off = noop;
            process.removeListener = noop;
            process.removeAllListeners = noop;
            process.emit = noop;
            process.binding = function(name) {
                throw new Error('process.binding is not supported');
            };
            process.cwd = function() {
                return '/';
            };
            process.chdir = function(dir) {
                throw new Error('process.chdir is not supported');
            };
            process.umask = function() {
                return 0;
            };
        }, {} ],
        25: [ function(_dereq_, module, exports) {
            var bundleFn = arguments[3];
            var sources = arguments[4];
            var cache = arguments[5];
            var stringify = JSON.stringify;
            module.exports = function(fn) {
                var keys = [];
                var wkey;
                var cacheKeys = Object.keys(cache);
                for (var i = 0, l = cacheKeys.length; i < l; i++) {
                    var key = cacheKeys[i];
                    var exp = cache[key].exports;
                    if (exp === fn || exp.default === fn) {
                        wkey = key;
                        break;
                    }
                }
                if (!wkey) {
                    wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                    var wcache = {};
                    for (var i = 0, l = cacheKeys.length; i < l; i++) {
                        var key = cacheKeys[i];
                        wcache[key] = key;
                    }
                    sources[wkey] = [ Function([ 'require', 'module', 'exports' ], '(' + fn + ')(self)'), wcache ];
                }
                var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                var scache = {};
                scache[wkey] = wkey;
                sources[skey] = [ Function([ 'require' ], 'var f = require(' + stringify(wkey) + ');' + '(f.default ? f.default : f)(self);'), scache ];
                var src = '(' + bundleFn + ')({' + Object.keys(sources).map(function(key) {
                    return stringify(key) + ':[' + sources[key][0] + ',' + stringify(sources[key][1]) + ']';
                }).join(',') + '},{},[' + stringify(skey) + '])';
                var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
                return new Worker(URL.createObjectURL(new Blob([ src ], {
                    type: 'text/javascript'
                })));
            };
        }, {} ]
    }, {}, [ 1 ])(1);
});
