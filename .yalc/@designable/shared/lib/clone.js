"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clone = exports.shallowClone = void 0;
var types_1 = require("./types");
var instanceof_1 = require("./instanceof");
var NATIVE_KEYS = [
    ['Map', function (map) { return new Map(map); }],
    ['WeakMap', function (map) { return new WeakMap(map); }],
    ['WeakSet', function (set) { return new WeakSet(set); }],
    ['Set', function (set) { return new Set(set); }],
    ['Date', function (date) { return new Date(date); }],
    'FileList',
    'File',
    'URL',
    'RegExp',
    [
        'Promise',
        function (promise) {
            return new Promise(function (resolve, reject) { return promise.then(resolve, reject); });
        },
    ],
];
var isNativeObject = function (values) {
    for (var i = 0; i < NATIVE_KEYS.length; i++) {
        var item = NATIVE_KEYS[i];
        if (Array.isArray(item) && item[0]) {
            if ((0, instanceof_1.instOf)(values, item[0])) {
                return item[1] ? item[1] : item[0];
            }
        }
        else {
            if ((0, instanceof_1.instOf)(values, item)) {
                return item;
            }
        }
    }
};
var shallowClone = function (values) {
    var nativeClone;
    if (Array.isArray(values)) {
        return values.slice(0);
    }
    else if (isNativeObject(values)) {
        nativeClone = isNativeObject(values);
        return (0, types_1.isFn)(nativeClone) ? nativeClone(values) : values;
    }
    else if (typeof values === 'object' && !!values) {
        return __assign({}, values);
    }
};
exports.shallowClone = shallowClone;
var clone = function (values, filter) {
    var nativeClone;
    if (Array.isArray(values)) {
        return values.map(function (item) { return (0, exports.clone)(item, filter); });
    }
    else if (isNativeObject(values)) {
        nativeClone = isNativeObject(values);
        return (0, types_1.isFn)(nativeClone) ? nativeClone(values) : values;
    }
    else if (typeof values === 'object' && !!values) {
        if ('$$typeof' in values && '_owner' in values) {
            return values;
        }
        if (values._isAMomentObject) {
            return values;
        }
        if (values._isJSONSchemaObject) {
            return values;
        }
        if ((0, types_1.isFn)(values.toJS)) {
            return values;
        }
        if ((0, types_1.isFn)(values.toJSON)) {
            return values;
        }
        if (Object.getOwnPropertySymbols(values || {}).length) {
            return values;
        }
        var res = {};
        for (var key in values) {
            if (Object.hasOwnProperty.call(values, key)) {
                if ((0, types_1.isFn)(filter)) {
                    if (filter(values[key], key)) {
                        res[key] = (0, exports.clone)(values[key], filter);
                    }
                    else {
                        res[key] = values[key];
                    }
                }
                else {
                    res[key] = (0, exports.clone)(values[key], filter);
                }
            }
        }
        return res;
    }
    else {
        return values;
    }
};
exports.clone = clone;
