'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = function (params) {

	params = (0, _clone2.default)(params);

	if ((typeof params === 'undefined' ? 'undefined' : _typeof(params)) !== 'object') {
		params = {};
	}

	var defaultKeys = Object.keys(_defaultParams2.default).filter(function (key) {
		return key !== 'iterations';
	});

	defaultKeys.forEach(function (key) {
		if (typeof params[key] !== 'number' || isNaN(params[key])) {
			params[key] = _defaultParams2.default[key];
		} else {
			params[key] = (0, _clamp2.default)(params[key], 0, 100);
		}

		params[key] = Math.round(params[key]);
	});

	if (typeof params.iterations !== 'number' || isNaN(params.iterations) || params.iterations <= 0) {
		params.iterations = _defaultParams2.default.iterations;
	}

	params.iterations = Math.round(params.iterations);

	return params;
};

var _clamp = require('../util/clamp');

var _clamp2 = _interopRequireDefault(_clamp);

var _clone = require('../util/clone');

var _clone2 = _interopRequireDefault(_clone);

var _defaultParams = require('./defaultParams');

var _defaultParams2 = _interopRequireDefault(_defaultParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];