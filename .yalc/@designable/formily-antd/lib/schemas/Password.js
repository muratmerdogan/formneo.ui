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
exports.Password = void 0;
var Input_1 = require("./Input");
exports.Password = {
    type: 'object',
    properties: __assign(__assign({}, Input_1.Input.properties), { checkStrength: {
            type: 'boolean',
            'x-decorator': 'FormItem',
            'x-component': 'Switch',
        } }),
};
