"use strict";
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
exports.SpaceBlock = void 0;
var react_1 = __importStar(require("react"));
var hooks_1 = require("../../hooks");
var reactive_react_1 = require("@formily/reactive-react");
var core_1 = require("@designable/core");
var shared_1 = require("@designable/shared");
exports.SpaceBlock = (0, reactive_react_1.observer)(function () {
    var cursor = (0, hooks_1.useCursor)();
    var transformHelper = (0, hooks_1.useTransformHelper)();
    var prefix = (0, hooks_1.usePrefix)('aux-space-block');
    if (cursor.status !== core_1.CursorStatus.Dragging)
        return null;
    var renderRulerBox = function (distance, type) {
        if (type === 'top' || type === 'bottom') {
            return (react_1.default.createElement("div", { className: prefix + '-ruler-v' },
                react_1.default.createElement("div", { className: prefix + '-ruler-indicator' },
                    react_1.default.createElement("span", null, distance === null || distance === void 0 ? void 0 : distance.toFixed(0)))));
        }
        else if (type === 'left' || type === 'right') {
            return (react_1.default.createElement("div", { className: prefix + '-ruler-h' },
                react_1.default.createElement("div", { className: prefix + '-ruler-indicator' },
                    react_1.default.createElement("span", null, distance === null || distance === void 0 ? void 0 : distance.toFixed(0)))));
        }
    };
    var renderDashedLine = function (line) {
        var rect = (0, shared_1.calcRectOfAxisLineSegment)(line);
        if (!rect)
            return null;
        var width = rect.width || 2;
        var height = rect.height || 2;
        return (react_1.default.createElement("svg", { width: width + 'px', height: height + 'px', viewBox: "0 0 ".concat(width, " ").concat(height), style: {
                top: 0,
                left: 0,
                transform: "perspective(1px) translate3d(".concat(line.start.x, "px,").concat(line.start.y, "px,0)"),
                position: 'absolute',
                zIndex: 3,
            } },
            react_1.default.createElement("line", { x1: line.start.x - rect.x, y1: line.start.y - rect.y, x2: line.end.x - rect.x, y2: line.end.y - rect.y, strokeDasharray: 4, stroke: "#745BFF", strokeWidth: 2 })));
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        transformHelper.measurerSpaceBlocks.map(function (_a, key) {
            var type = _a.type, crossDragNodesRect = _a.crossDragNodesRect, distance = _a.distance, extendsLine = _a.extendsLine;
            return (react_1.default.createElement(react_1.Fragment, null,
                renderDashedLine(extendsLine),
                react_1.default.createElement("div", { key: key, style: {
                        top: 0,
                        left: 0,
                        height: crossDragNodesRect.height,
                        width: crossDragNodesRect.width,
                        transform: "perspective(1px) translate3d(".concat(crossDragNodesRect.x, "px,").concat(crossDragNodesRect.y, "px,0)"),
                        position: 'absolute',
                        zIndex: 3,
                    } }, renderRulerBox(distance, type))));
        }),
        transformHelper.thresholdSpaceBlocks.map(function (_a, key) {
            var rect = _a.rect;
            return (react_1.default.createElement("div", { key: key, className: prefix, style: {
                    top: 0,
                    left: 0,
                    height: rect.height,
                    width: rect.width,
                    transform: "perspective(1px) translate3d(".concat(rect.x, "px,").concat(rect.y, "px,0)"),
                    position: 'absolute',
                    background: 'rgba(255, 0, 0, 0.2)',
                    zIndex: 1,
                } }));
        })));
});
exports.SpaceBlock.displayName = 'SpaceBlock';
