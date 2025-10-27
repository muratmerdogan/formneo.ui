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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Selection = exports.SelectionBox = void 0;
var react_1 = __importStar(require("react"));
var Helpers_1 = require("./Helpers");
var ResizeHandler_1 = require("./ResizeHandler");
var hooks_1 = require("../../hooks");
var reactive_react_1 = require("@formily/reactive-react");
var TranslateHandler_1 = require("./TranslateHandler");
var SelectionBox = function (props) {
    var _a;
    var _b;
    var designer = (0, hooks_1.useDesigner)();
    var prefix = (0, hooks_1.usePrefix)('aux-selection-box');
    var innerPrefix = (0, hooks_1.usePrefix)('aux-selection-box-inner');
    var nodeRect = (0, hooks_1.useValidNodeOffsetRect)(props.node);
    var createSelectionStyle = function () {
        var baseStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            boxSizing: 'border-box',
            zIndex: 4,
        };
        if (nodeRect) {
            baseStyle.transform = "perspective(1px) translate3d(".concat(nodeRect.x, "px,").concat(nodeRect.y, "px,0)");
            baseStyle.height = nodeRect.height;
            baseStyle.width = nodeRect.width;
        }
        return baseStyle;
    };
    if (!nodeRect)
        return null;
    if (!nodeRect.width || !nodeRect.height)
        return null;
    var selectionId = (_a = {},
        _a[(_b = designer.props) === null || _b === void 0 ? void 0 : _b.nodeSelectionIdAttrName] = props.node.id,
        _a);
    return (react_1.default.createElement("div", __assign({}, selectionId, { className: prefix, style: createSelectionStyle() }),
        react_1.default.createElement("div", { className: innerPrefix }),
        react_1.default.createElement(ResizeHandler_1.ResizeHandler, { node: props.node }),
        react_1.default.createElement(TranslateHandler_1.TranslateHandler, { node: props.node }),
        props.showHelpers && (react_1.default.createElement(Helpers_1.Helpers, __assign({}, props, { node: props.node, nodeRect: nodeRect })))));
};
exports.SelectionBox = SelectionBox;
exports.Selection = (0, reactive_react_1.observer)(function () {
    var selection = (0, hooks_1.useSelection)();
    var tree = (0, hooks_1.useTree)();
    var cursor = (0, hooks_1.useCursor)();
    var viewportMoveHelper = (0, hooks_1.useMoveHelper)();
    if (cursor.status !== 'NORMAL' && viewportMoveHelper.touchNode)
        return null;
    return (react_1.default.createElement(react_1.Fragment, null, selection.selected.map(function (id) {
        var node = tree.findById(id);
        if (!node)
            return;
        if (node.hidden)
            return;
        return (react_1.default.createElement(exports.SelectionBox, { key: id, node: node, showHelpers: selection.selected.length === 1 }));
    })));
});
exports.Selection.displayName = 'Selection';
