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
exports.CollapseItem = void 0;
var react_1 = __importStar(require("react"));
var react_2 = require("@formily/react");
var react_3 = require("@designable/react");
var classnames_1 = __importDefault(require("classnames"));
require("./styles.less");
exports.CollapseItem = (0, react_2.observer)(function (props) {
    var _a;
    var prefix = (0, react_3.usePrefix)('collapse-item');
    var field = (0, react_2.useField)();
    var _b = __read((0, react_1.useState)((_a = props.defaultExpand) !== null && _a !== void 0 ? _a : true), 2), expand = _b[0], setExpand = _b[1];
    return (react_1.default.createElement("div", { className: (0, classnames_1.default)(prefix, props.className, { expand: expand }), style: props.style },
        react_1.default.createElement("div", { className: prefix + '-header', onClick: function (e) {
                e.stopPropagation();
                e.preventDefault();
                setExpand(!expand);
            } },
            react_1.default.createElement("div", { className: prefix + '-header-expand' },
                react_1.default.createElement(react_3.IconWidget, { infer: "Expand", size: 10 })),
            react_1.default.createElement("div", { className: prefix + '-header-content' }, field.title)),
        react_1.default.createElement("div", { className: prefix + '-content' }, props.children)));
});
