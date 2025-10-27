var isType = function (type) {
    return function (obj) {
        return obj != null &&
            (Array.isArray(type) ? type : [type]).some(function (t) { return getType(obj) === "[object ".concat(t, "]"); });
    };
};
export var getType = function (obj) { return Object.prototype.toString.call(obj); };
export var isFn = isType([
    'Function',
    'AsyncFunction',
    'GeneratorFunction',
]);
export var isWindow = isType('Window');
export var isHTMLElement = function (obj) {
    return (obj === null || obj === void 0 ? void 0 : obj['nodeName']) || (obj === null || obj === void 0 ? void 0 : obj['tagName']);
};
export var isArr = Array.isArray;
export var isPlainObj = isType('Object');
export var isStr = isType('String');
export var isBool = isType('Boolean');
export var isNum = isType('Number');
export var isObj = function (val) { return typeof val === 'object'; };
export var isRegExp = isType('RegExp');
export var isValid = function (val) { return val !== null && val !== undefined; };
export var isValidNumber = function (val) {
    return !isNaN(val) && isNum(val);
};
