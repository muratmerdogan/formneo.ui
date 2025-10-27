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
exports.BorderRadiusStyleSetter = void 0;
var react_1 = __importDefault(require("react"));
var react_2 = require("@designable/react");
var BoxStyleSetter_1 = require("../BoxStyleSetter");
var BorderRadiusStyleSetter = function (props) {
    return (react_1.default.createElement(BoxStyleSetter_1.BoxStyleSetter, __assign({}, props, { labels: [
            react_1.default.createElement(react_2.IconWidget, { infer: "TopLeft", size: 16, key: "1" }),
            react_1.default.createElement(react_2.IconWidget, { infer: "TopRight", size: 16, key: "2" }),
            react_1.default.createElement(react_2.IconWidget, { infer: "BottomRight", size: 16, key: "3" }),
            react_1.default.createElement(react_2.IconWidget, { infer: "BottomLeft", size: 16, key: "4" }),
        ] })));
};
exports.BorderRadiusStyleSetter = BorderRadiusStyleSetter;
