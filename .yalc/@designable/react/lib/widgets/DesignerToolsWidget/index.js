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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignerToolsWidget = void 0;
var react_1 = __importStar(require("react"));
var antd_1 = require("antd");
var reactive_react_1 = require("@formily/reactive-react");
var core_1 = require("@designable/core");
var hooks_1 = require("../../hooks");
var IconWidget_1 = require("../IconWidget");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.DesignerToolsWidget = (0, reactive_react_1.observer)(function (props) {
    var screen = (0, hooks_1.useScreen)();
    var cursor = (0, hooks_1.useCursor)();
    var workbench = (0, hooks_1.useWorkbench)();
    var history = (0, hooks_1.useHistory)();
    var sizeRef = (0, react_1.useRef)({});
    var prefix = (0, hooks_1.usePrefix)('designer-tools');
    var renderHistoryController = function () {
        if (!props.use.includes('HISTORY'))
            return null;
        return (react_1.default.createElement(antd_1.Button.Group, { size: "small", style: { marginRight: 20 } },
            react_1.default.createElement(antd_1.Button, { size: "small", disabled: !(history === null || history === void 0 ? void 0 : history.allowUndo), onClick: function () {
                    history.undo();
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Undo" })),
            react_1.default.createElement(antd_1.Button, { size: "small", disabled: !(history === null || history === void 0 ? void 0 : history.allowRedo), onClick: function () {
                    history.redo();
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Redo" }))));
    };
    var renderCursorController = function () {
        if (workbench.type !== 'DESIGNABLE')
            return null;
        if (!props.use.includes('CURSOR'))
            return null;
        return (react_1.default.createElement(antd_1.Button.Group, { size: "small", style: { marginRight: 20 } },
            react_1.default.createElement(antd_1.Button, { size: "small", disabled: cursor.type === core_1.CursorType.Normal, onClick: function () {
                    cursor.setType(core_1.CursorType.Normal);
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Move" })),
            react_1.default.createElement(antd_1.Button, { size: "small", disabled: cursor.type === core_1.CursorType.Selection, onClick: function () {
                    cursor.setType(core_1.CursorType.Selection);
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Selection" }))));
    };
    var renderResponsiveController = function () {
        if (!props.use.includes('SCREEN_TYPE'))
            return null;
        if (screen.type !== core_1.ScreenType.Responsive)
            return null;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(antd_1.InputNumber, { size: "small", value: screen.width, style: { width: 70, textAlign: 'center' }, onChange: function (value) {
                    sizeRef.current.width = value;
                }, onPressEnter: function () {
                    screen.setSize(sizeRef.current.width, screen.height);
                } }),
            react_1.default.createElement(IconWidget_1.IconWidget, { size: 10, infer: "Close", style: { padding: '0 3px', color: '#999' } }),
            react_1.default.createElement(antd_1.InputNumber, { value: screen.height, size: "small", style: {
                    width: 70,
                    textAlign: 'center',
                    marginRight: 10,
                }, onChange: function (value) {
                    sizeRef.current.height = value;
                }, onPressEnter: function () {
                    screen.setSize(screen.width, sizeRef.current.height);
                } }),
            (screen.width !== '100%' || screen.height !== '100%') && (react_1.default.createElement(antd_1.Button, { size: "small", style: { marginRight: 20 }, onClick: function () {
                    screen.resetSize();
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Recover" })))));
    };
    var renderScreenTypeController = function () {
        if (!props.use.includes('SCREEN_TYPE'))
            return null;
        return (react_1.default.createElement(antd_1.Button.Group, { size: "small", style: { marginRight: 20 } },
            react_1.default.createElement(antd_1.Button, { size: "small", disabled: screen.type === core_1.ScreenType.PC, onClick: function () {
                    screen.setType(core_1.ScreenType.PC);
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "PC" })),
            react_1.default.createElement(antd_1.Button, { size: "small", disabled: screen.type === core_1.ScreenType.Mobile, onClick: function () {
                    screen.setType(core_1.ScreenType.Mobile);
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Mobile" })),
            react_1.default.createElement(antd_1.Button, { size: "small", disabled: screen.type === core_1.ScreenType.Responsive, onClick: function () {
                    screen.setType(core_1.ScreenType.Responsive);
                } },
                react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Responsive" }))));
    };
    var renderMobileController = function () {
        if (!props.use.includes('SCREEN_TYPE'))
            return null;
        if (screen.type !== core_1.ScreenType.Mobile)
            return;
        return (react_1.default.createElement(antd_1.Button, { size: "small", style: { marginRight: 20 }, onClick: function () {
                screen.setFlip(!screen.flip);
            } },
            react_1.default.createElement(IconWidget_1.IconWidget, { infer: "Flip", style: {
                    transition: 'all .15s ease-in',
                    transform: screen.flip ? 'rotate(-90deg)' : '',
                } })));
    };
    return (react_1.default.createElement("div", { style: props.style, className: (0, classnames_1.default)(prefix, props.className) },
        renderHistoryController(),
        renderCursorController(),
        renderScreenTypeController(),
        renderMobileController(),
        renderResponsiveController()));
});
exports.DesignerToolsWidget.defaultProps = {
    use: ['HISTORY', 'CURSOR', 'SCREEN_TYPE'],
};
