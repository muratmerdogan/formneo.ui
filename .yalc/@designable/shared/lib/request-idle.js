"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelIdle = exports.requestIdle = void 0;
require("requestidlecallback");
var globalThisPolyfill_1 = require("./globalThisPolyfill");
var requestIdle = function (callback, options) {
    return globalThisPolyfill_1.globalThisPolyfill['requestIdleCallback'](callback, options);
};
exports.requestIdle = requestIdle;
var cancelIdle = function (id) {
    globalThisPolyfill_1.globalThisPolyfill['cancelIdleCallback'](id);
};
exports.cancelIdle = cancelIdle;
