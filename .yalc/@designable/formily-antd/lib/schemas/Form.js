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
exports.Form = void 0;
var FormLayout_1 = require("./FormLayout");
var CSSStyle_1 = require("./CSSStyle");
exports.Form = {
    type: 'object',
    properties: __assign(__assign({}, FormLayout_1.FormLayout.properties), { style: CSSStyle_1.CSSStyle }),
};
