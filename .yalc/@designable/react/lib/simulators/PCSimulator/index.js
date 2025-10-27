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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PCSimulator = void 0;
var react_1 = __importDefault(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var hooks_1 = require("../../hooks");
require("./styles.less");
var PCSimulator = function (props) {
    var prefix = (0, hooks_1.usePrefix)('pc-simulator');
    return (react_1.default.createElement("div", __assign({}, props, { className: (0, classnames_1.default)(prefix, props.className) }), props.children));
};
exports.PCSimulator = PCSimulator;
