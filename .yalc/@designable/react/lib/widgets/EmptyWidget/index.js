"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmptyWidget = void 0;
var react_1 = __importDefault(require("react"));
var hooks_1 = require("../../hooks");
var reactive_react_1 = require("@formily/reactive-react");
var IconWidget_1 = require("../IconWidget");
require("./styles.less");
exports.EmptyWidget = (0, reactive_react_1.observer)(function (props) {
    var _a;
    var tree = (0, hooks_1.useTree)();
    var prefix = (0, hooks_1.usePrefix)('empty');
    var renderEmpty = function () {
        return (react_1.default.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
            react_1.default.createElement("div", { className: "animations" },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: props.dragTipsDirection === 'left'
                        ? 'DragLeftSourceAnimation'
                        : 'DragRightSourceAnimation', size: 240 }),
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "BatchDragAnimation", size: 240 })),
            react_1.default.createElement("div", { className: "hotkeys-list" },
                react_1.default.createElement("div", null,
                    "Selection ",
                    react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Command" }),
                    " + Click /",
                    ' ',
                    react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Shift" }),
                    " + Click /",
                    ' ',
                    react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Command" }),
                    " + A"),
                react_1.default.createElement("div", null,
                    "Copy ",
                    react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Command" }),
                    " + C / Paste",
                    ' ',
                    react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Command" }),
                    " + V"),
                react_1.default.createElement("div", null,
                    "Delete ",
                    react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Delete" })))));
    };
    if (!((_a = tree === null || tree === void 0 ? void 0 : tree.children) === null || _a === void 0 ? void 0 : _a.length)) {
        return (react_1.default.createElement("div", { className: prefix }, props.children ? props.children : renderEmpty()));
    }
    return null;
});
exports.EmptyWidget.defaultProps = {
    dragTipsDirection: 'left',
};
