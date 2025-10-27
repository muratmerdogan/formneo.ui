"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapLine = void 0;
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../../hooks");
var reactive_react_1 = require("@formily/reactive-react");
var core_1 = require("@designable/core");
exports.SnapLine = (0, reactive_react_1.observer)(function () {
    var cursor = (0, hooks_1.useCursor)();
    var transformHelper = (0, hooks_1.useTransformHelper)();
    var prefix = (0, hooks_1.usePrefix)('aux-snap-line');
    var createLineStyle = function (rect) {
        var baseStyle = {
            top: 0,
            left: 0,
            height: rect.height || 1,
            width: rect.width || 1,
            transform: "perspective(1px) translate3d(".concat(rect.x, "px,").concat(rect.y, "px,0)"),
            background: "#b0b1f3",
            position: 'absolute',
            zIndex: 2,
        };
        return baseStyle;
    };
    if (cursor.status !== core_1.CursorStatus.Dragging)
        return null;
    return (react_1.default.createElement(react_1.default.Fragment, null, transformHelper.closestSnapLines.map(function (line, key) {
        if (line.type !== 'normal')
            return null;
        return (react_1.default.createElement("div", { key: key, className: prefix, style: createLineStyle(line.rect) }));
    })));
});
exports.SnapLine.displayName = 'SnapLine';
