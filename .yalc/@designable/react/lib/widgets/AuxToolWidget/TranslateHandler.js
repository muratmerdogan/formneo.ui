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
exports.TranslateHandler = void 0;
var react_1 = __importDefault(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var TranslateHandler = function (props) {
    var designer = (0, hooks_1.useDesigner)();
    var prefix = (0, hooks_1.usePrefix)('aux-node-translate-handler');
    var createHandler = function (value) {
        var _a;
        return _a = {},
            _a[designer.props.nodeTranslateAttrName] = value,
            _a.className = (0, classnames_1.default)(prefix, value),
            _a;
    };
    var allowTranslate = props.node.allowTranslate();
    if (!allowTranslate)
        return null;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", __assign({}, createHandler('translate')),
            react_1.default.createElement(IconWidget_1.IconWidget, { infer: "FreeMove" }))));
};
exports.TranslateHandler = TranslateHandler;
