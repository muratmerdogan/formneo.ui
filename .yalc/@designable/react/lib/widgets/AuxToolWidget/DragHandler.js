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
exports.DragHandler = void 0;
var react_1 = __importDefault(require("react"));
var reactive_react_1 = require("@formily/reactive-react");
var IconWidget_1 = require("../IconWidget");
var hooks_1 = require("../../hooks");
var antd_1 = require("antd");
exports.DragHandler = (0, reactive_react_1.observer)(function (_a) {
    var _b;
    var node = _a.node, style = _a.style;
    var designer = (0, hooks_1.useDesigner)();
    var prefix = (0, hooks_1.usePrefix)('aux-drag-handler');
    if (node === node.root || !node.allowDrag())
        return null;
    var handlerProps = (_b = {},
        _b[designer.props.nodeDragHandlerAttrName] = 'true',
        _b);
    return (react_1.default.createElement(antd_1.Button, __assign({}, handlerProps, { className: prefix, style: style, type: "primary" }),
        react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Move" })));
});
exports.DragHandler.displayName = 'DragHandler';
