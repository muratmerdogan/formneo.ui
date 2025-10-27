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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputItems = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@designable/react");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
var InputItemsContext = react_1.default.createContext(null);
var InputItems = function (props) {
    var prefix = (0, react_2.usePrefix)('input-items');
    return (react_1.default.createElement(InputItemsContext.Provider, { value: props },
        react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, props.className), style: props.style }, props.children)));
};
exports.InputItems = InputItems;
exports.InputItems.defaultProps = {
    width: '100%',
};
exports.InputItems.Item = function (props) {
    var prefix = (0, react_2.usePrefix)('input-items-item');
    var ctx = (0, react_1.useContext)(InputItemsContext);
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, props.className, {
            vertical: props.vertical || ctx.vertical,
        }), style: __assign({ width: props.width || ctx.width }, props.style) },
        props.icon && (react_1.default.createElement("div", { className: prefix + '-icon' },
            react_1.default.createElement(react_2.IconWidget, { infer: props.icon, size: 16 }))),
        props.title && react_1.default.createElement("div", { className: prefix + '-title' }, props.title),
        react_1.default.createElement("div", { className: prefix + '-controller' }, props.children)));
};
