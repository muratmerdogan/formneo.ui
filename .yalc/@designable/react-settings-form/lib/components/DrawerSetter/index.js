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
exports.DrawerSetter = void 0;
var react_1 = __importStar(require("react"));
var react_dom_1 = require("react-dom");
var react_2 = require("@formily/react");
var antd_1 = require("@formily/antd");
var react_3 = require("@designable/react");
var antd_2 = require("antd");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.DrawerSetter = (0, react_2.observer)(function (props) {
    var node = (0, react_3.useTreeNode)();
    var field = (0, react_2.useField)();
    var _a = __read((0, react_1.useState)(false), 2), visible = _a[0], setVisible = _a[1];
    var _b = __read((0, react_1.useState)(false), 2), remove = _b[0], setRemove = _b[1];
    var _c = __read((0, react_1.useState)(), 2), root = _c[0], setRoot = _c[1];
    var prefix = (0, react_3.usePrefix)('drawer-setter');
    var formWrapperCls = (0, react_3.usePrefix)('settings-form-wrapper');
    (0, react_1.useLayoutEffect)(function () {
        var wrapper = document.querySelector('.' + formWrapperCls);
        if (wrapper) {
            setRoot(wrapper);
        }
    }, [node]);
    var renderDrawer = function () {
        if (root && visible) {
            return (0, react_dom_1.createPortal)(react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, 'animate__animated animate__slideInRight', {
                    animate__slideOutRight: remove,
                }) },
                react_1.default.createElement("div", { className: prefix + '-header', onClick: handleClose },
                    react_1.default.createElement(react_3.IconWidget, { infer: "Return", size: 18 }),
                    react_1.default.createElement("span", { className: prefix + '-header-text' }, props.text || field.title)),
                react_1.default.createElement("div", { className: prefix + '-body' },
                    react_1.default.createElement(antd_1.FormLayout, { colon: false, labelWidth: 120, labelAlign: "left", wrapperAlign: "right", feedbackLayout: "none", tooltipLayout: "text" }, props.children))), root);
        }
        return null;
    };
    var handleOpen = function () {
        setVisible(true);
    };
    var handleClose = function () {
        setRemove(true);
        setTimeout(function () {
            setVisible(false);
            setRemove(false);
        }, 150);
    };
    return (react_1.default.createElement(react_1.Fragment, null,
        react_1.default.createElement(antd_2.Button, __assign({ block: true, onClick: handleOpen }, props.triggerProps), props.text || field.title),
        renderDrawer()));
});
