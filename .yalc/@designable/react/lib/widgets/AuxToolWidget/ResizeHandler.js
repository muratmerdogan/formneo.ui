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
exports.ResizeHandler = void 0;
var react_1 = __importDefault(require("react"));
var classnames_1 = __importDefault(require("classnames"));
var hooks_1 = require("../../hooks");
var ResizeHandler = function (props) {
    var designer = (0, hooks_1.useDesigner)();
    var prefix = (0, hooks_1.usePrefix)('aux-node-resize-handler');
    var createHandler = function (value) {
        var _a;
        return _a = {},
            _a[designer.props.nodeResizeHandlerAttrName] = value,
            _a.className = (0, classnames_1.default)(prefix, value),
            _a;
    };
    var allowResize = props.node.allowResize();
    if (!allowResize)
        return null;
    var allowX = allowResize.includes('x');
    var allowY = allowResize.includes('y');
    return (react_1.default.createElement(react_1.default.Fragment, null,
        allowX && react_1.default.createElement("div", __assign({}, createHandler('left-center'))),
        allowX && react_1.default.createElement("div", __assign({}, createHandler('right-center'))),
        allowY && react_1.default.createElement("div", __assign({}, createHandler('center-top'))),
        allowY && react_1.default.createElement("div", __assign({}, createHandler('center-bottom'))),
        allowX && allowY && react_1.default.createElement("div", __assign({}, createHandler('left-top'))),
        allowY && allowY && react_1.default.createElement("div", __assign({}, createHandler('right-top'))),
        allowX && allowY && react_1.default.createElement("div", __assign({}, createHandler('left-bottom'))),
        allowY && allowY && react_1.default.createElement("div", __assign({}, createHandler('right-bottom')))));
};
exports.ResizeHandler = ResizeHandler;
