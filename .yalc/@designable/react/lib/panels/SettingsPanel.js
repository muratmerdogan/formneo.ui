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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsPanel = void 0;
var react_1 = __importStar(require("react"));
var shared_1 = require("@designable/shared");
var reactive_react_1 = require("@formily/reactive-react");
var widgets_1 = require("../widgets");
var hooks_1 = require("../hooks");
var classnames_1 = __importDefault(require("classnames"));
exports.SettingsPanel = (0, reactive_react_1.observer)(function (props) {
    var prefix = (0, hooks_1.usePrefix)('settings-panel');
    var workbench = (0, hooks_1.useWorkbench)();
    var _a = __read((0, react_1.useState)(true), 2), innerVisible = _a[0], setInnerVisible = _a[1];
    var _b = __read((0, react_1.useState)(false), 2), pinning = _b[0], setPinning = _b[1];
    var _c = __read((0, react_1.useState)(true), 2), visible = _c[0], setVisible = _c[1];
    (0, react_1.useEffect)(function () {
        if (visible || workbench.type === 'DESIGNABLE') {
            if (!innerVisible) {
                (0, shared_1.requestIdle)(function () {
                    requestAnimationFrame(function () {
                        setInnerVisible(true);
                    });
                });
            }
        }
    }, [visible, workbench.type]);
    if (workbench.type !== 'DESIGNABLE') {
        if (innerVisible)
            setInnerVisible(false);
        return null;
    }
    if (!visible) {
        if (innerVisible)
            setInnerVisible(false);
        return (react_1.default.createElement("div", { className: prefix + '-opener', onClick: function () {
                setVisible(true);
            } },
            react_1.default.createElement(widgets_1.IconWidget, { infer: "Setting", size: 20 })));
    }
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, { pinning: pinning }) },
        react_1.default.createElement("div", { className: prefix + '-header' },
            react_1.default.createElement("div", { className: prefix + '-header-title' },
                react_1.default.createElement(widgets_1.TextWidget, null, props.title)),
            react_1.default.createElement("div", { className: prefix + '-header-actions' },
                react_1.default.createElement("div", { className: prefix + '-header-extra' }, props.extra),
                !pinning && (react_1.default.createElement(widgets_1.IconWidget, { infer: "PushPinOutlined", className: prefix + '-header-pin', onClick: function () {
                        setPinning(!pinning);
                    } })),
                pinning && (react_1.default.createElement(widgets_1.IconWidget, { infer: "PushPinFilled", className: prefix + '-pin-filled', onClick: function () {
                        setPinning(!pinning);
                    } })),
                react_1.default.createElement(widgets_1.IconWidget, { infer: "Close", className: prefix + '-header-close', onClick: function () {
                        setVisible(false);
                    } }))),
        react_1.default.createElement("div", { className: prefix + '-body' }, innerVisible && props.children)));
});
