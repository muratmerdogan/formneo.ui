"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashedBox = void 0;
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../../hooks");
var reactive_react_1 = require("@formily/reactive-react");
exports.DashedBox = (0, reactive_react_1.observer)(function () {
    var hover = (0, hooks_1.useHover)();
    var prefix = (0, hooks_1.usePrefix)('aux-dashed-box');
    var selection = (0, hooks_1.useSelection)();
    var rect = (0, hooks_1.useValidNodeOffsetRect)(hover === null || hover === void 0 ? void 0 : hover.node);
    var createTipsStyle = function () {
        var baseStyle = {
            top: 0,
            left: 0,
            pointerEvents: 'none',
            boxSizing: 'border-box',
            visibility: 'hidden',
            zIndex: 2,
        };
        if (rect) {
            baseStyle.transform = "perspective(1px) translate3d(".concat(rect.x, "px,").concat(rect.y, "px,0)");
            baseStyle.height = rect.height;
            baseStyle.width = rect.width;
            baseStyle.visibility = 'visible';
        }
        return baseStyle;
    };
    if (!hover.node)
        return null;
    if (hover.node.hidden)
        return null;
    if (selection.selected.includes(hover.node.id))
        return null;
    return (react_1.default.createElement("div", { className: prefix, style: createTipsStyle() },
        react_1.default.createElement("span", { className: prefix + '-title', style: {
                position: 'absolute',
                bottom: '100%',
                left: 0,
                fontSize: 12,
                userSelect: 'none',
                fontWeight: 'lighter',
                whiteSpace: 'nowrap',
            } }, hover === null || hover === void 0 ? void 0 : hover.node.getMessage('title'))));
});
exports.DashedBox.displayName = 'DashedBox';
