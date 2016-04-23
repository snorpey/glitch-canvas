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
            './glitch/browser/imageDataToBase64': 4,
            './glitch/glitchImageData': 7,
            './input/browser/fromImage': 9,
            './input/sanitizeInput': 11,
            './output/browser/toImage': 12,
            './output/toImageData': 13,
            './workers/glitchWorker': 20,
            webworkify: 22
        } ],
        2: [ function(_dereq_, module, exports) {
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
        3: [ function(_dereq_, module, exports) {
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
            './base64Map': 2
        } ],
        4: [ function(_dereq_, module, exports) {
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
            '../../util/isImageData': 18,
            'canvas-browserify': 21
        } ],
        5: [ function(_dereq_, module, exports) {
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
            './base64Map': 2
        } ],
        6: [ function(_dereq_, module, exports) {
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
            './jpgHeaderLength': 8
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
            '../util/isImageData': 18,
            './base64ToByteArray': 3,
            './byteArrayToBase64': 5,
            './glitchByteArray': 6
        } ],
        8: [ function(_dereq_, module, exports) {
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
        9: [ function(_dereq_, module, exports) {
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
            'canvas-browserify': 21
        } ],
        10: [ function(_dereq_, module, exports) {
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
        11: [ function(_dereq_, module, exports) {
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
            '../util/clamp': 15,
            '../util/clone': 16,
            './defaultParams': 10
        } ],
        12: [ function(_dereq_, module, exports) {
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
            '../../util/loadBase64Image': 19
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
            '../util/canvasFromImage': 14,
            '../util/getImageSize': 17,
            '../util/loadBase64Image': 19
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
            './getImageSize': 17,
            'canvas-browserify': 21
        } ],
        15: [ function(_dereq_, module, exports) {
            'use strict';
            Object.defineProperty(exports, '__esModule', {
                value: !0
            }), exports['default'] = function(value, min, max) {
                return min > value ? min : value > max ? max : value;
            }, module.exports = exports['default'];
        }, {} ],
        16: [ function(_dereq_, module, exports) {
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
        17: [ function(_dereq_, module, exports) {
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
        18: [ function(_dereq_, module, exports) {
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
        19: [ function(_dereq_, module, exports) {
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
            'canvas-browserify': 21
        } ],
        20: [ function(_dereq_, module, exports) {
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
            '../glitch/glitchImageData': 7
        } ],
        21: [ function(_dereq_, module, exports) {
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
        22: [ function(_dereq_, module, exports) {
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
