"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidNumber = exports.isValid = exports.isRegExp = exports.isObj = exports.isNum = exports.isBool = exports.isStr = exports.isPlainObj = exports.isArr = exports.isHTMLElement = exports.isWindow = exports.isFn = exports.getType = void 0;
var isType = function (type) {
    return function (obj) {
        return obj != null &&
            (Array.isArray(type) ? type : [type]).some(function (t) { return (0, exports.getType)(obj) === "[object ".concat(t, "]"); });
    };
};
var getType = function (obj) { return Object.prototype.toString.call(obj); };
exports.getType = getType;
exports.isFn = isType([
    'Function',
    'AsyncFunction',
    'GeneratorFunction',
]);
exports.isWindow = isType('Window');
var isHTMLElement = function (obj) {
    return (obj === null || obj === void 0 ? void 0 : obj['nodeName']) || (obj === null || obj === void 0 ? void 0 : obj['tagName']);
};
exports.isHTMLElement = isHTMLElement;
exports.isArr = Array.isArray;
exports.isPlainObj = isType('Object');
exports.isStr = isType('String');
exports.isBool = isType('Boolean');
exports.isNum = isType('Number');
var isObj = function (val) { return typeof val === 'object'; };
exports.isObj = isObj;
exports.isRegExp = isType('RegExp');
var isValid = function (val) { return val !== null && val !== undefined; };
exports.isValid = isValid;
var isValidNumber = function (val) {
    return !isNaN(val) && (0, exports.isNum)(val);
};
exports.isValidNumber = isValidNumber;
