"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = void 0;
var compose = function () {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return function (payload) {
        return fns.reduce(function (buf, fn) {
            return fn(buf);
        }, payload);
    };
};
exports.compose = compose;
