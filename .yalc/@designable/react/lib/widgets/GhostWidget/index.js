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
exports.GhostWidget = void 0;
var react_1 = __importStar(require("react"));
var hooks_1 = require("../../hooks");
var core_1 = require("@designable/core");
var reactive_1 = require("@formily/reactive");
var reactive_react_1 = require("@formily/reactive-react");
var NodeTitleWidget_1 = require("../NodeTitleWidget");
require("./styles.less");
exports.GhostWidget = (0, reactive_react_1.observer)(function () {
    var designer = (0, hooks_1.useDesigner)();
    var cursor = (0, hooks_1.useCursor)();
    var ref = (0, react_1.useRef)();
    var prefix = (0, hooks_1.usePrefix)('ghost');
    var movingNodes = designer.findMovingNodes();
    var firstNode = movingNodes[0];
    (0, react_1.useEffect)(function () {
        return (0, reactive_1.autorun)(function () {
            var _a, _b;
            var transform = "perspective(1px) translate3d(".concat(((_a = cursor.position) === null || _a === void 0 ? void 0 : _a.topClientX) - 18, "px,").concat(((_b = cursor.position) === null || _b === void 0 ? void 0 : _b.topClientY) - 12, "px,0) scale(0.8)");
            if (!ref.current)
                return;
            ref.current.style.transform = transform;
        });
    }, [designer, cursor]);
    var renderNodes = function () {
        return (react_1.default.createElement("span", { style: {
                whiteSpace: 'nowrap',
            } },
            react_1.default.createElement(NodeTitleWidget_1.NodeTitleWidget, { node: firstNode }),
            movingNodes.length > 1 ? '...' : ''));
    };
    if (!firstNode)
        return null;
    return cursor.status === core_1.CursorStatus.Dragging ? (react_1.default.createElement("div", { ref: ref, className: prefix }, renderNodes())) : null;
});
exports.GhostWidget.displayName = 'GhostWidget';
